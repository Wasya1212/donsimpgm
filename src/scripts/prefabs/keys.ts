const KEY_CODES: any = {
  "37": "LEFT",
  "39": "RIGHT",
  "32": "SPACE"
};

function getKey(keyCode: number): string {
  return KEY_CODES[keyCode];
}

export { getKey };
