import mongoose from 'mongoose';
import Universe from './src/models/Universe.js';

// Helper to clean MongoDB Extended JSON format (e.g. $oid, $numberInt)
const cleanData = (obj) => {
  if (Array.isArray(obj)) return obj.map(cleanData);
  if (typeof obj !== 'object' || obj === null) return obj;

  // Handle specific MongoDB export keys
  if (obj['$oid']) return obj['$oid'];
  if (obj['$numberInt']) return parseInt(obj['$numberInt'], 10);
  if (obj['$numberDouble']) return parseFloat(obj['$numberDouble']);
  if (obj['$date'] && obj['$date']['$numberLong']) return new Date(parseInt(obj['$date']['$numberLong'], 10));

  const newObj = {};
  for (const key in obj) {
    if (key === '_id') continue; // Let Mongoose generate new IDs or handle carefully
    if (key === '__v') continue;
    newObj[key] = cleanData(obj[key]);
  }
  return newObj;
};

// The provided JSON data
const rawData = {
  "query": "love",
  "theme": {
    "name": "Passion",
    "background": "radial-gradient(circle at center, #4a0e16 0%, #1a0508 100%)",
    "lineColor": "#ff0055",
    "particleColor": "#ff99aa",
    "fontColor": "#ffddee",
    "vibeDescription": "A nebula of emotions and connections.",
    "nodeColors": {
      "ROOT": "#ff0055",
      "ANSWER": "#ff6688",
      "USER": "#ff99aa",
      "GROUP": "#ff3366",
      "KEYWORD": "#882244"
    }
  },
  "nodes": [
    {"id":"root","label":"LOVE","type":"ROOT","x":{"$numberInt":"500"},"y":{"$numberInt":"400"},"vx":{"$numberInt":"0"},"vy":{"$numberInt":"0"},"radius":{"$numberInt":"40"},"val":{"$numberInt":"10"},"color":"#ff0055","details":"The singularity of \"love\"."},
    {"id":"9wz2jymg1","label":"The Thinkers","type":"GROUP","x":{"$numberDouble":"454.1296523512231"},"y":{"$numberDouble":"246.5455593792399"},"vx":{"$numberDouble":"0.5308466417319546"},"vy":{"$numberDouble":"0.9399448606490295"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff3366","details":"A group node related to love."},
    {"id":"5x5onqg8w","label":"Future_00","type":"KEYWORD","x":{"$numberDouble":"448.5758188116518"},"y":{"$numberDouble":"461.2825716587346"},"vx":{"$numberDouble":"0.12295746229259219"},"vy":{"$numberDouble":"-0.8776675071016116"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"mrgpblbet","label":"Link_01","type":"KEYWORD","x":{"$numberDouble":"494.433989481647"},"y":{"$numberDouble":"320.1938628493423"},"vx":{"$numberDouble":"-0.8627459878093577"},"vy":{"$numberDouble":"-0.28426482172487466"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"xebyfnzqm","label":"General Chat","type":"GROUP","x":{"$numberDouble":"559.6202656382"},"y":{"$numberDouble":"215.0257442468894"},"vx":{"$numberDouble":"0.7644070983636508"},"vy":{"$numberDouble":"-0.014421594794519432"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff3366","details":"A group node related to love."},
    {"id":"h227gfxc5","label":"Deep_10","type":"KEYWORD","x":{"$numberDouble":"424.5143455497726"},"y":{"$numberDouble":"426.49369683945343"},"vx":{"$numberDouble":"0.40554349926375943"},"vy":{"$numberDouble":"-0.6942763500755196"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"qw0lmb86w","label":"Bot_X_11","type":"USER","x":{"$numberDouble":"573.4317529437083"},"y":{"$numberDouble":"368.25448599228224"},"vx":{"$numberDouble":"-0.9860450461270203"},"vy":{"$numberDouble":"0.674067117944551"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff99aa","details":"A user node related to love.","img":"https://api.dicebear.com/7.x/avataaars/svg?seed=Bot_X_11"},
    {"id":"aermyv0ce","label":"Seeker01_12","type":"USER","x":{"$numberDouble":"569.7844000279479"},"y":{"$numberDouble":"439.1169721826645"},"vx":{"$numberDouble":"-0.4952547268020613"},"vy":{"$numberDouble":"-0.5503770829474974"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff99aa","details":"A user node related to love.","img":"https://api.dicebear.com/7.x/avataaars/svg?seed=Seeker01_12"},
    {"id":"9x8okaab7","label":"Deep Dive","type":"GROUP","x":{"$numberDouble":"414.905873939539"},"y":{"$numberDouble":"264.9903612362779"},"vx":{"$numberDouble":"0.5096669632268833"},"vy":{"$numberDouble":"0.23663594750721284"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff3366","details":"A group node related to love."},
    {"id":"6qagko6x9","label":"Idea_20","type":"KEYWORD","x":{"$numberDouble":"571.8487441158778"},"y":{"$numberDouble":"435.18178461890625"},"vx":{"$numberDouble":"0.5360257567851825"},"vy":{"$numberDouble":"-0.5566170630011436"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"xcpp85p9k","label":"Random","type":"GROUP","x":{"$numberDouble":"571.6547569980752"},"y":{"$numberDouble":"548.2499042948436"},"vx":{"$numberDouble":"0.5334882780566352"},"vy":{"$numberDouble":"0.9561881599966884"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff3366","details":"A group node related to love."},
    {"id":"jvr3kejpa","label":"Source_30","type":"KEYWORD","x":{"$numberDouble":"443.2667708884096"},"y":{"$numberDouble":"456.4033750282002"},"vx":{"$numberDouble":"-0.2818866459742786"},"vy":{"$numberDouble":"0.9717471999297675"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"jhx3eeyd9","label":"Link_31","type":"KEYWORD","x":{"$numberDouble":"569.7307170918523"},"y":{"$numberDouble":"439.2125884615649"},"vx":{"$numberDouble":"0.6717923390851355"},"vy":{"$numberDouble":"0.9269587192589697"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"dncxmvyxj","label":"This is the way.","type":"ANSWER","x":{"$numberDouble":"386.1882824074512"},"y":{"$numberDouble":"514.9655481849908"},"vx":{"$numberDouble":"-0.14124123455361914"},"vy":{"$numberDouble":"0.6447813198209849"},"radius":{"$numberInt":"25"},"val":{"$numberInt":"5"},"color":"#ff6688","details":"A answer node related to love."},
    {"id":"zq9r5nte7","label":"Seeker01_40","type":"USER","x":{"$numberDouble":"460.5819365633412"},"y":{"$numberDouble":"330.38522947747697"},"vx":{"$numberDouble":"0.1995484350371144"},"vy":{"$numberDouble":"0.19660711167876244"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff99aa","details":"A user node related to love.","img":"https://api.dicebear.com/7.x/avataaars/svg?seed=Seeker01_40"},
    {"id":"krbi63c50","label":"Orbit_41","type":"KEYWORD","x":{"$numberDouble":"479.20475639731836"},"y":{"$numberDouble":"322.75003013913124"},"vx":{"$numberDouble":"0.3264058968666337"},"vy":{"$numberDouble":"0.7262286904036759"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"k5o81r23t","label":"Dr_Strange_42","type":"USER","x":{"$numberDouble":"425.7951661328808"},"y":{"$numberDouble":"429.8938560703239"},"vx":{"$numberDouble":"0.648972790818132"},"vy":{"$numberDouble":"0.4433686477356189"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff99aa","details":"A user node related to love.","img":"https://api.dicebear.com/7.x/avataaars/svg?seed=Dr_Strange_42"},
    {"id":"3dz5froaq","label":"42","type":"ANSWER","x":{"$numberDouble":"337.79054692398813"},"y":{"$numberDouble":"496.8400389551637"},"vx":{"$numberDouble":"0.01827167008243613"},"vy":{"$numberDouble":"0.9925297249786418"},"radius":{"$numberInt":"25"},"val":{"$numberInt":"5"},"color":"#ff6688","details":"A answer node related to love."},
    {"id":"mmwreq04u","label":"Star_Lord_50","type":"USER","x":{"$numberDouble":"483.19186660748835"},"y":{"$numberDouble":"478.21436346259895"},"vx":{"$numberDouble":"0.23853360762448395"},"vy":{"$numberDouble":"-0.6547257730202958"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff99aa","details":"A user node related to love.","img":"https://api.dicebear.com/7.x/avataaars/svg?seed=Star_Lord_50"},
    {"id":"qs7ch4kct","label":"Meaning_51","type":"KEYWORD","x":{"$numberDouble":"499.9874234422848"},"y":{"$numberDouble":"479.9999990114387"},"vx":{"$numberDouble":"-0.03454338957068037"},"vy":{"$numberDouble":"0.18634255438388347"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"twwxgjbq2","label":"Bot_X_52","type":"USER","x":{"$numberDouble":"579.2231946798628"},"y":{"$numberDouble":"411.12139490875825"},"vx":{"$numberDouble":"0.43446431173299827"},"vy":{"$numberDouble":"-0.3319239107426868"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff99aa","details":"A user node related to love.","img":"https://api.dicebear.com/7.x/avataaars/svg?seed=Bot_X_52"},
    {"id":"3uonloitq","label":"It depends on context.","type":"ANSWER","x":{"$numberDouble":"468.2490155589714"},"y":{"$numberDouble":"558.3111522102134"},"vx":{"$numberDouble":"0.5293353951597339"},"vy":{"$numberDouble":"-0.8347483151488855"},"radius":{"$numberInt":"25"},"val":{"$numberInt":"5"},"color":"#ff6688","details":"A answer node related to love."},
    {"id":"8iaiek0kd","label":"Bot_X_60","type":"USER","x":{"$numberDouble":"545.7783564768897"},"y":{"$numberDouble":"465.60748492569127"},"vx":{"$numberDouble":"0.3266803496434765"},"vy":{"$numberDouble":"0.6888678795539191"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff99aa","details":"A user node related to love.","img":"https://api.dicebear.com/7.x/avataaars/svg?seed=Bot_X_60"},
    {"id":"uccpg7hpx","label":"Concept_61","type":"KEYWORD","x":{"$numberDouble":"475.2669565772534"},"y":{"$numberDouble":"476.08072399135364"},"vx":{"$numberDouble":"-0.03000237873053102"},"vy":{"$numberDouble":"0.5456095768450342"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"dw4a8otvz","label":"Future_62","type":"KEYWORD","x":{"$numberDouble":"427.7484767509176"},"y":{"$numberDouble":"434.3470142543322"},"vx":{"$numberDouble":"-0.12894192304418883"},"vy":{"$numberDouble":"0.8783822039621603"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"a1lq2onvc","label":"Search deeper within.","type":"ANSWER","x":{"$numberDouble":"346.4272868698786"},"y":{"$numberDouble":"346.85069561987495"},"vx":{"$numberDouble":"0.46981846435612207"},"vy":{"$numberDouble":"0.0009778695491959866"},"radius":{"$numberInt":"25"},"val":{"$numberInt":"5"},"color":"#ff6688","details":"A answer node related to love."},
    {"id":"xx0ury202","label":"Pulse_70","type":"KEYWORD","x":{"$numberDouble":"500.14765919511007"},"y":{"$numberDouble":"320.0001362703529"},"vx":{"$numberDouble":"-0.17243472411638772"},"vy":{"$numberDouble":"-0.4524841617912787"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"rf481ab7d","label":"Meaning_71","type":"KEYWORD","x":{"$numberDouble":"547.517051990114"},"y":{"$numberDouble":"335.64062018502045"},"vx":{"$numberDouble":"-0.7460226457648909"},"vy":{"$numberDouble":"-0.814898500396541"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"iplqal2d1","label":"Neo_99_72","type":"USER","x":{"$numberDouble":"555.8435163574915"},"y":{"$numberDouble":"342.71560700478193"},"vx":{"$numberDouble":"-0.40382025555977874"},"vy":{"$numberDouble":"0.08705955966989176"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff99aa","details":"A user node related to love.","img":"https://api.dicebear.com/7.x/avataaars/svg?seed=Neo_99_72"},
    {"id":"dhwcwv835","label":"Connection found.","type":"ANSWER","x":{"$numberDouble":"605.3754966915825"},"y":{"$numberDouble":"519.7607331502601"},"vx":{"$numberDouble":"-0.39997143886675124"},"vy":{"$numberDouble":"-0.045662305256263025"},"radius":{"$numberInt":"25"},"val":{"$numberInt":"5"},"color":"#ff6688","details":"A answer node related to love."},
    {"id":"sxm60vnfs","label":"Bot_X_80","type":"USER","x":{"$numberDouble":"579.6260778783544"},"y":{"$numberDouble":"392.2742170810827"},"vx":{"$numberDouble":"-0.47374142466607383"},"vy":{"$numberDouble":"0.810165026396501"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff99aa","details":"A user node related to love.","img":"https://api.dicebear.com/7.x/avataaars/svg?seed=Bot_X_80"},
    {"id":"73vnpf6ed","label":"Expanding...","type":"ANSWER","x":{"$numberDouble":"494.4101303558604"},"y":{"$numberDouble":"204.37144999159867"},"vx":{"$numberDouble":"0.14071157423250735"},"vy":{"$numberDouble":"0.7876094024165368"},"radius":{"$numberInt":"25"},"val":{"$numberInt":"5"},"color":"#ff6688","details":"A answer node related to love."},
    {"id":"afxqp67p0","label":"Pulse_90","type":"KEYWORD","x":{"$numberDouble":"456.98375630423305"},"y":{"$numberDouble":"467.4507433488052"},"vx":{"$numberDouble":"-0.08689470658988574"},"vy":{"$numberDouble":"0.8564072610519267"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"7dm4otpzm","label":"Alice_W_91","type":"USER","x":{"$numberDouble":"445.93167769669697"},"y":{"$numberDouble":"458.96284019029395"},"vx":{"$numberDouble":"0.47918745047806466"},"vy":{"$numberDouble":"-0.37094882722367206"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff99aa","details":"A user node related to love.","img":"https://api.dicebear.com/7.x/avataaars/svg?seed=Alice_W_91"},
    {"id":"pd9yxy5gc","label":"Cosmic_Dev_92","type":"USER","x":{"$numberDouble":"424.1959429050409"},"y":{"$numberDouble":"374.431563834599"},"vx":{"$numberDouble":"0.3843220547649797"},"vy":{"$numberDouble":"-0.8725125593826926"},"radius":{"$numberInt":"20"},"val":{"$numberInt":"4"},"color":"#ff99aa","details":"A user node related to love.","img":"https://api.dicebear.com/7.x/avataaars/svg?seed=Cosmic_Dev_92"},
    {"id":"8aat986r9","label":"Future","type":"KEYWORD","x":{"$numberDouble":"555.989861692853"},"y":{"$numberDouble":"643.6496160218916"},"vx":{"$numberDouble":"-0.9782500128172975"},"vy":{"$numberDouble":"-0.6615452585148196"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"w9dlvkbvz","label":"Idea","type":"KEYWORD","x":{"$numberDouble":"254.25665335396928"},"y":{"$numberDouble":"354.06300424267187"},"vx":{"$numberDouble":"-0.5830790179810186"},"vy":{"$numberDouble":"0.7112805948074512"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"lv8vjhqyq","label":"Concept","type":"KEYWORD","x":{"$numberDouble":"490.6176780962828"},"y":{"$numberDouble":"649.8238820363158"},"vx":{"$numberDouble":"-0.8226919651913835"},"vy":{"$numberDouble":"-0.24945237009215981"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"nymtpq9ew","label":"Deep","type":"KEYWORD","x":{"$numberDouble":"630.6596732774495"},"y":{"$numberDouble":"613.138569430852"},"vx":{"$numberDouble":"-0.9998508654867968"},"vy":{"$numberDouble":"0.17618447255551262"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."},
    {"id":"chnamapdb","label":"Link","type":"KEYWORD","x":{"$numberDouble":"745.4090469149814"},"y":{"$numberDouble":"447.69066672086274"},"vx":{"$numberDouble":"0.6053103380642426"},"vy":{"$numberDouble":"-0.3121371738349725"},"radius":{"$numberInt":"15"},"val":{"$numberInt":"3"},"color":"#882244","details":"A keyword node related to love."}
  ],
  "links": [
    {"source":"root","target":"9wz2jymg1","value":{"$numberInt":"1"}},
    {"source":"9wz2jymg1","target":"5x5onqg8w","value":{"$numberInt":"1"}},
    {"source":"9wz2jymg1","target":"mrgpblbet","value":{"$numberInt":"1"}},
    {"source":"root","target":"xebyfnzqm","value":{"$numberInt":"1"}},
    {"source":"xebyfnzqm","target":"h227gfxc5","value":{"$numberInt":"1"}},
    {"source":"xebyfnzqm","target":"qw0lmb86w","value":{"$numberInt":"1"}},
    {"source":"xebyfnzqm","target":"aermyv0ce","value":{"$numberInt":"1"}},
    {"source":"root","target":"9x8okaab7","value":{"$numberInt":"1"}},
    {"source":"9x8okaab7","target":"6qagko6x9","value":{"$numberInt":"1"}},
    {"source":"root","target":"xcpp85p9k","value":{"$numberInt":"1"}},
    {"source":"xcpp85p9k","target":"jvr3kejpa","value":{"$numberInt":"1"}},
    {"source":"xcpp85p9k","target":"jhx3eeyd9","value":{"$numberInt":"1"}},
    {"source":"root","target":"dncxmvyxj","value":{"$numberInt":"1"}},
    {"source":"dncxmvyxj","target":"zq9r5nte7","value":{"$numberInt":"1"}},
    {"source":"dncxmvyxj","target":"krbi63c50","value":{"$numberInt":"1"}},
    {"source":"dncxmvyxj","target":"k5o81r23t","value":{"$numberInt":"1"}},
    {"source":"root","target":"3dz5froaq","value":{"$numberInt":"1"}},
    {"source":"3dz5froaq","target":"mmwreq04u","value":{"$numberInt":"1"}},
    {"source":"3dz5froaq","target":"qs7ch4kct","value":{"$numberInt":"1"}},
    {"source":"3dz5froaq","target":"twwxgjbq2","value":{"$numberInt":"1"}},
    {"source":"root","target":"3uonloitq","value":{"$numberInt":"1"}},
    {"source":"3uonloitq","target":"8iaiek0kd","value":{"$numberInt":"1"}},
    {"source":"3uonloitq","target":"uccpg7hpx","value":{"$numberInt":"1"}},
    {"source":"3uonloitq","target":"dw4a8otvz","value":{"$numberInt":"1"}},
    {"source":"root","target":"a1lq2onvc","value":{"$numberInt":"1"}},
    {"source":"a1lq2onvc","target":"xx0ury202","value":{"$numberInt":"1"}},
    {"source":"a1lq2onvc","target":"rf481ab7d","value":{"$numberInt":"1"}},
    {"source":"a1lq2onvc","target":"iplqal2d1","value":{"$numberInt":"1"}},
    {"source":"root","target":"dhwcwv835","value":{"$numberInt":"1"}},
    {"source":"dhwcwv835","target":"sxm60vnfs","value":{"$numberInt":"1"}},
    {"source":"root","target":"73vnpf6ed","value":{"$numberInt":"1"}},
    {"source":"73vnpf6ed","target":"afxqp67p0","value":{"$numberInt":"1"}},
    {"source":"73vnpf6ed","target":"7dm4otpzm","value":{"$numberInt":"1"}},
    {"source":"73vnpf6ed","target":"pd9yxy5gc","value":{"$numberInt":"1"}},
    {"source":"root","target":"8aat986r9","value":{"$numberInt":"1"}},
    {"source":"root","target":"w9dlvkbvz","value":{"$numberInt":"1"}},
    {"source":"root","target":"lv8vjhqyq","value":{"$numberInt":"1"}},
    {"source":"root","target":"nymtpq9ew","value":{"$numberInt":"1"}},
    {"source":"root","target":"chnamapdb","value":{"$numberInt":"1"}}
  ]
};

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://nguyenthianh1232345:tiN8hQ0Hym9Xzatg@cluster0.tsxs9.mongodb.net/hxi';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding...');
    
    // Clean and prepare data
    const seed = cleanData(rawData);
    
    try {
      // Check if it exists
      const existing = await Universe.findOne({ query: seed.query });
      if (existing) {
        console.log(`Universe for "${seed.query}" already exists. Deleting old one...`);
        await Universe.deleteOne({ _id: existing._id });
      }

      const universe = new Universe(seed);
      await universe.save();
      console.log(`Successfully seeded universe for "${seed.query}"!`);
    } catch (e) {
      console.error('Error seeding data:', e);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => console.error('Connection error:', err));
