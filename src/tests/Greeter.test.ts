import { IReadyEventObject } from '../common/types';
import DiscordClient from '../DiscordClient';

test('Sanity', () => {
  expect(true).toBe(true);
});

const client = new DiscordClient({
  token: "TOKEN"
})

client.on("READY", () => {
  return false;
});