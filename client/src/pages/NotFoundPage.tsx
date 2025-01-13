import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-500">Error 404 not found</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full flex-col items-center justify-center gap-3">
        <p>Sorry, the page you are looking for could not be found.</p>
        <Button variant="secondary">
          <Link to="/" className="">
            Back to home page
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
