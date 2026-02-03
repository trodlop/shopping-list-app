export function removeItemFromArray(array, item) {

    const item_index = array.indexOf(item);
    if (item_index > -1) { // only splice array when item is found
        array.splice(item_index, 1); // 2nd parameter means remove one item only
    };

    return array;
    
};

export function removeItemFromObject(object, key) {
    
};