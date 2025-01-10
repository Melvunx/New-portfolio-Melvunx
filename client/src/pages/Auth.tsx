import { SubmitButton } from "@/components/SubmitButtton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  return (
    <Tabs defaultValue="signup">
      <TabsList className="mx-auto flex w-1/3 items-center justify-between">
        <TabsTrigger className="w-full" value="signup">
          Sign up
        </TabsTrigger>
        <TabsTrigger className="w-full" value="signin">
          Sign in
        </TabsTrigger>
      </TabsList>
      <TabsContent value="signup">
        <Card className="mx-auto flex w-2/3 flex-col">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col items-center justify-center gap-6">
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
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col ">
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
