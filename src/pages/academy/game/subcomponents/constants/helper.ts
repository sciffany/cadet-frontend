export function flatten(child: any): Array<any> {
  const siblings = [];
  while (child) {
    siblings.push(child);
    child = child.nextElementSibling;
  }
  return siblings;
}
