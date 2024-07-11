export const sectionalPieces = [
  {
    id: 1,
    uid:1,
    name: "Gather Deep Corner",
    image:
     // "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_82/item_661_82_2480_0.thumb.jpg?v=73",
      "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_82/item_661_82_2480_0.thumb.jpg?v=73"   
      ,show_default: true,
    in_between: [
    ],
  },
  {
    id: 3,
    uid:3,
    name: "Gather Deep Armless Chair",
    show_default: false,
    image:"https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_58/item_661_58_2480_0.thumb.jpg?v=73",
    in_between: [
      { "between": [1, 4] },
      { "between": [3, 4] },
      { "between": [3, 1] },
      { "between": [4, 3] },

    ],
  },
  {
    id: 4,
    uid:4,
    name: "Gather Deep Armless Loveseat",
    show_default: true,

    image:
      "https://s3.ca-central-1.amazonaws.com/exocortex-crateandbarrel/exocortex-crateandbarrel/SectionalPlanner/661_108/item_661_108_2480_0.thumb.jpg?v=73",
    in_between: [
      { "between": [3, 3] },
      { "between": [3, 4] },

    ],
  },

];
