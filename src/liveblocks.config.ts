import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: "pk_dev_your_key_here", // Replace with your Liveblocks public key
});

type Presence = {
  cursor: { x: number; y: number } | null;
  username: string;
};

export const { RoomProvider, useOthers, useUpdateMyPresence, useMyPresence } =
  createRoomContext<Presence>(client);