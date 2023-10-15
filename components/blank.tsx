import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { ShieldQuestion } from "lucide-react";

interface IProps {
  title?: String;
  description?: String;
  href?: String;
  linkText?: String;
  icon?: Boolean;
}

const Blank = ({ title, description, href, linkText, icon }: IProps) => {
  return (
    <Card className="flex flex-col items-center p-5 border-dashed bg-transparent text-center">
      {title && <CardTitle className="text-md">{title}</CardTitle>}
      {description && (
        <CardDescription className="mb-5">{description}</CardDescription>
      )}
      {href && linkText && (
        <Button variant={"outline"}>
          <Link href={href}>{linkText}</Link>
        </Button>
      )}
      {icon && <ShieldQuestion />}
    </Card>
  );
};

export default Blank;
