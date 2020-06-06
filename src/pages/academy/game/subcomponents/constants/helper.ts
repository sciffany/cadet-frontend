function flatten(child: any) {
  var siblings = [child];
  while (child) {
    child = child.nextElementSibling;
  }
  siblings.push(child);
}
