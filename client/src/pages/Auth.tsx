import { ModeToggle } from "@/components/mode-toggle";
import { SubmitButton } from "@/components/SubmitButtton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const { login } = useAuth();

  const onLoginAction = async (data: FormData) => {
    const username = String(data.get("username"));
    const password = String(data.get("password"));

    await login(username, password);
  };

  return (
    <Tabs defaultValue="signup">
      <TabsList className="mx-auto flex w-2/5 items-center justify-evenly gap-4">
        <TabsTrigger className="w-full" value="signup">
          Sign up
        </TabsTrigger>
        <TabsTrigger className="w-full" value="signin">
          Sign in
        </TabsTrigger>
        <div className="bg-transparent">
          <ModeToggle />
        </div>
      </TabsList>
      <TabsContent value="signup">
        <Card className="mx-auto flex w-2/3 flex-col">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={onLoginAction}
              className="flex flex-col items-center justify-center gap-6"
            >
              <div className="">
                <Label htmlFor="user">Username</Label>
                <Input id="user" name="username" />
              </div>
              <div className="">
                <Label htmlFor="pass">Password</Label>
                <Input id="pass" name="password" type="password" />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="signin">
        <Card className="mx-auto flex w-2/3 flex-col">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col items-center justify-center gap-6">
              <div className="">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" />
              </div>
              <div className="">
                <Label htmlFor="lastname">Lastname</Label>
                <Input id="lastname" name="lastname" />
              </div>
              <div className="">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" />
              </div>
              <div className="">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
              <div className="">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
