import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import userOperations from "../../graphql/operations/user";
import { useMutation } from "@apollo/client";
import { ICreateUsername, ICreateUsernameVars } from "@/lib/types";
import toast from "react-hot-toast";
import { usernameSchema } from "@/lib/val";

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");
  const [createUsername, { loading, error }] = useMutation<
    ICreateUsername,
    ICreateUsernameVars
  >(userOperations.Mutations.createUsername);

  // console.log("Response from createUsername ",data, loading, error);

  const onSubmit = async () => {
    if (!username) return;
    const valUsername = usernameSchema.safeParse(username);
    if (!valUsername.success) {
      // console.log(valUsername.error);
      toast.error("Username should contain only alphabets, numbers, @, #, _");
      // toast.error(valUsername.error?.message);
      return;
    }
    console.log("API Fired...");
    try {
      const { data } = await createUsername({ variables: { username } });
      if (!data?.createUsername) {
        throw new Error();
      }
      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }
      toast.success("Username Successfully created 🚀");
      reloadSession();
    } catch (e: any) {
      toast.error(e?.message);
      console.log("OnSubmit Error ", e);
    }
  };

  return (
    <Center height="100vh">
      <Stack align="center" spacing={8}>
        {session ? (
          <>
            <Text fontSize="2xl">Create a Username</Text>
            <Input
              placeholder="Enter a Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}></Input>
            <Button
              onClick={onSubmit}
              isLoading={loading}
              isDisabled={!username}>
              Submit
            </Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">myMessage</Text>
            <Button
              leftIcon={<Image height="20px" src="/images/googlelogo.png" />}
              onClick={() => signIn("google")}>
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
