import { Button, Html } from "@react-email/components";

type EmailProps = {
  message: string;
  url: string;
  accountId: string;
};

const Email: React.FC<EmailProps> = ({ url, message, accountId }) => {
  return (
    <Html lang="en">
      <Button href={url}>Click</Button>
      <div className="text-red-400">{message}</div>
      <strong>{accountId}</strong>
    </Html>
  );
};

export default Email;
