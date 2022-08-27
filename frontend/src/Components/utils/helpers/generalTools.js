// takes in an updated array value, the array that value was from and a modifier for any situations that aren't standard
// outputs an updated array where the newvalue has taken the place of the original
// does this by locating the original value within the array using id, type is used if no id will be present and another criteria is required to locate original value.
// once found array is spread into a new mutable version inorder to ensure to issues with immutable arrays and a splice is used to insert the updated item before returning mutated array
export function updateItemInArray(item, array, type) {
  // locates original item in provided array
  let originalItem;
  switch (type) {
    case 'newPuppy': {
      originalItem = array.find(original => original.realname === item.realname);
      break;
    }
    default: {
      originalItem = array.find(original => original.id === item.id);
    }
  }

  // makes new mutable array out of provided
  let newArray = [...array];
  // splices in provided item into provided array
  newArray.splice(array.indexOf(originalItem), 1, item);

  return newArray;
}

// array to translate backend colour ids to their actual meaning
export const colours = [
  { id: 0, colour: "No Preferance" },
  { id: 1, colour: "Black" },
  { id: 2, colour: "Gold" },
  { id: 3, colour: "Black and Tan" },
  { id: 4, colour: "Blue Roan" },
  { id: 5, colour: "Blue Roan and Tan" },
  { id: 6, colour: "Orange Roan" },
  { id: 7, colour: "Black and White" },
  { id: 8, colour: "Black, White and Tan" },
  { id: 9, colour: "Gold and White" },
  { id: 10, colour: "Chocolate (Liver)" },
  { id: 11, colour: "Liver and Tan" },
  { id: 12, colour: "Liver Roan" },
  { id: 13, colour: "Liver Roan and Tan" }
];

export const healthTestKeys = {
  pra: 0,
  fn: 0,
  aon: 0,
  ams: 0,
  bss: 0,
};

export const healthTestValues = [
  {
    id: 0,
    status: 'Unknown'
  },
  {
    id: 1,
    status: 'Clear'
  },
  {
    id: 2,
    status: 'Carrier'
  },
  {
    id: 3,
    status: 'Affected'
  },
];