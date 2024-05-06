import Auth from "@/components/Auth";
import Chat from "@/components/Chat";
import { Box, Button } from "@chakra-ui/react";
import { NextPageContext } from "next";
import { getSession, signOut, useSession } from "next-auth/react";

export default function Home() {

  const {data : session} = useSession();
  // console.log("Here is session ",session);
  const reloadsession = () => {
    console.log('reloading session...');
    const event = new Event("visibilitychange")
    document.dispatchEvent(event)
  }
  
  return (
    <Box>
      {session?.user.username ? <Chat session={session}/> : <Auth session={session} reloadSession={reloadsession}/>}
    </Box>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  return {
    props: {
      session
    },
  };
}