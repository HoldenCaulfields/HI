

export default function user({ params }: { params: {id: string} }) {
    return <h1>Hello {params.id}</h1>;
}

