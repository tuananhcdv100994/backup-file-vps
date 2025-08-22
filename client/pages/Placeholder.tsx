import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, ArrowLeft, Construction } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function Placeholder({
  title,
  description,
  icon,
}: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-neo-blue-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Về trang chủ
        </Link>

        <Card className="neo-card text-center">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 neo-glow">
                {icon || <Construction className="w-8 h-8 text-white" />}
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Trang này đang được phát triển. Vui lòng quay lại sau hoặc tiếp
              tục khám phá các tính năng khác.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/">
                <Button className="w-full neo-button text-white">
                  Về trang chủ
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full">
                  Đến Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-neo-blue-500 to-neo-blue-600">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Tạo chatbot AI by Plugai</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Liên hệ hỗ trợ: 07.927.627.94
          </p>
        </div>
      </div>
    </div>
  );
}
