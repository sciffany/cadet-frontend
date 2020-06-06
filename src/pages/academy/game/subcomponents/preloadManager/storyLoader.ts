import Constants from '../constants/constants';

declare const window: any;

export async function loadStoryXmlWithDeps(storyId: string) {
  const story = await loadOneStoryXml(storyId);
  const depStoryId = story.getAttribute('dependencies');
  const depStory = await loadOneStoryXml(depStoryId);
  return [story, depStory];
}

export async function loadOneStoryXml(storyId: string) {
  const url = Constants.storyXMLPathTest + storyId + '.story.xml';
  const response = await fetch(url);
  const message = await response.text();
  const storyXml = new window.DOMParser().parseFromString(message, 'text/xml');
  const [story] = storyXml.children;
  return story;
}
