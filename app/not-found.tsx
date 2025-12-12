import Link from "next/link";
import { Search, Home, FileQuestion, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold text-primary">404</h1>
          <h2 className="text-3xl font-bold">Page not found</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Here are some helpful links to get you back on track.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <Link href="/" className="group">
            <Card className="h-full hover:shadow-md transition-all border-primary/20 hover:border-primary/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Homepage</h3>
                  <p className="text-sm text-muted-foreground">Return to the start</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/services" className="group">
            <Card className="h-full hover:shadow-md transition-all border-primary/20 hover:border-primary/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Our Services</h3>
                  <p className="text-sm text-muted-foreground">Explore what we do</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/help" className="group">
            <Card className="h-full hover:shadow-md transition-all border-primary/20 hover:border-primary/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FileQuestion className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Help Center</h3>
                  <p className="text-sm text-muted-foreground">Find answers & guides</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/contact" className="group">
            <Card className="h-full hover:shadow-md transition-all border-primary/20 hover:border-primary/50">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Contact Us</h3>
                  <p className="text-sm text-muted-foreground">Get in touch directly</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="pt-8 border-t">
          <p className="text-muted-foreground mb-4">
            Looking for something specific?
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/demo">Book a Strategy Call</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
