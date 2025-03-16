"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Backend URL

export default function Chatbox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const peerAudioRef = useRef<HTMLAudioElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    socket.on("receive_message", ({ username, message }) => {
      setMessages((prev) => [...prev, { username, message }]);
    });

    socket.on("update_users", (usersList) => {
      setUsers(usersList);
    });

    socket.on("offer", async (offer) => {
      if (!peerConnection.current) createPeerConnection();

      await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current!.createAnswer();
      await peerConnection.current!.setLocalDescription(answer);

      socket.emit("answer", answer);
    });

    socket.on("answer", async (answer) => {
      await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async (candidate) => {
      if (peerConnection.current) {
        await peerConnection.current!.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("update_users");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, []);

  const joinRoom = () => {
    if (searchTerm.trim() && username.trim()) {
      socket.emit("join_room", { searchTerm, username });
      setJoinedRoom(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", { searchTerm, username, message });
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const toggleVoiceChat = async () => {
    if (isVoiceActive) {
      stopVoiceChat();
    } else {
      startVoiceChat();
    }
  };

  const startVoiceChat = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = localStream.current;
      }

      createPeerConnection();
      localStream.current.getTracks().forEach((track) => peerConnection.current!.addTrack(track, localStream.current!));

      const offer = await peerConnection.current!.createOffer();
      await peerConnection.current!.setLocalDescription(offer);

      socket.emit("offer", offer);
      setIsVoiceActive(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopVoiceChat = () => {
    // Stop microphone
    localStream.current?.getTracks().forEach((track) => track.stop());
    localStream.current = null;

    // Close peer connection
    peerConnection.current?.close();
    peerConnection.current = null;

    setIsVoiceActive(false);
  };

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection();

    peerConnection.current.ontrack = (event) => {
      if (peerAudioRef.current) {
        peerAudioRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
      }
    };
  };

  return (
    <div className="flex flex-col items-center p-8 w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {!joinedRoom ? (
        <div className="flex flex-col gap-6 w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-4">Join Chat</h2>
          <input
            type="text"
            placeholder="Enter your username..."
            className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Type your search..."
            className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out" onClick={joinRoom}>
            Join Chat
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col gap-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="h-96 overflow-y-auto bg-gray-700 p-4 rounded-lg">
            {messages.map((msg, index) => (
              <div key={index} className="bg-gray-600 p-3 my-2 rounded-md">
                <strong className="text-blue-300">{msg.username}:</strong> <span className="text-gray-200">{msg.message}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-gray-700 p-3 rounded-md">
              <strong className="text-yellow-300">Users in chat:</strong> <span className="text-gray-300">{users.join(", ")}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="p-3 flex-1 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-md transition duration-300 ease-in-out" onClick={sendMessage}>
                Send
              </button>
            </div>
            <button
              className={`px-6 py-3 mt-4 font-bold rounded-md transition duration-300 ease-in-out ${
                isVoiceActive ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"
              }`}
              onClick={toggleVoiceChat}
            >
              {isVoiceActive ? "Stop Voice Chat" : "Start Voice Chat"}
            </button>
            <audio ref={localAudioRef} autoPlay playsInline className="hidden" />
            <audio ref={peerAudioRef} autoPlay playsInline className="hidden" />
          </div>
        </div>
      )}
    </div>
  );
}