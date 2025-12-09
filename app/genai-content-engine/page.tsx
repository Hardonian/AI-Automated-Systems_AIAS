import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "GenAI Content Engine — Automated Website Creation | AIAS Platform",
  description: "AI-powered blog and article analysis engine that automatically generates website content. Systems thinking + GenAI creates optimized, SEO-friendly websites from your content.",
};

export default function GenAIContentEnginePage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          GenAI Content Engine
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          AI-powered blog and article analysis engine that automatically generates optimized website content. 
          Systems thinking + GenAI creates websites from your content, analyzing structure, SEO, and user experience.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          🤖 GenAI • 🧠 Systems Thinking • 📝 Automated Content Creation
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">How It Works: Systems Thinking + GenAI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold">Upload Your Content</p>
                    <p className="text-sm text-muted-foreground">
                      Upload blog posts, articles, or existing website content. The engine analyzes structure, SEO, keywords, and user experience.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold">Systems Thinking Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Our systems thinking engine analyzes your content from multiple perspectives: SEO, structure, readability, 
                      user experience, and conversion optimization. It identifies gaps and opportunities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold">GenAI Content Generation</p>
                    <p className="text-sm text-muted-foreground">
                      GenAI generates optimized website pages, blog posts, and content based on systems thinking analysis. 
                      Content is SEO-optimized, user-friendly, and conversion-focused.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                  <div>
                    <p className="font-semibold">Automated Website Creation</p>
                    <p className="text-sm text-muted-foreground">
                      The engine automatically creates or updates your website with optimized content, proper structure, 
                      meta tags, and SEO elements. Systems thinking ensures optimal user experience.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Why Systems Thinking + GenAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>The Problem with GenAI Alone</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Generates content without strategy</li>
                  <li>• Missing SEO optimization</li>
                  <li>• No user experience consideration</li>
                  <li>• Ignores conversion optimization</li>
                  <li>• No systems perspective</li>
                  <li>• Content exists in isolation</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Systems Thinking + GenAI Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Analyzes from multiple perspectives</li>
                  <li>• SEO-optimized content generation</li>
                  <li>• User experience focused</li>
                  <li>• Conversion-optimized</li>
                  <li>• Systems thinking integration</li>
                  <li>• Holistic website creation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Multi-Perspective Content Analysis</CardTitle>
              <CardDescription>
                Our systems thinking engine analyzes your content from 6 perspectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">1. SEO Perspective</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyzes keywords, meta tags, headings, content structure, and search optimization opportunities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. User Experience Perspective</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Evaluates readability, navigation, user flow, accessibility, and conversion paths.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Content Structure Perspective</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyzes content hierarchy, information architecture, and logical flow.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4. Conversion Perspective</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Identifies CTAs, conversion opportunities, and optimization points.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">5. Technical SEO Perspective</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Evaluates page speed, mobile optimization, structured data, and technical requirements.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">6. Systems Architecture Perspective</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Understands how content fits into overall website system and user journey.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">GenAI Content Generation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Blog Post Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Analyze existing blog posts</li>
                  <li>• Identify SEO gaps</li>
                  <li>• Generate optimized versions</li>
                  <li>• Suggest improvements</li>
                  <li>• Create related content</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Website Page Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Generate landing pages</li>
                  <li>• Create service pages</li>
                  <li>• Build product pages</li>
                  <li>• Optimize existing pages</li>
                  <li>• Maintain consistency</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>SEO Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Keyword research and integration</li>
                  <li>• Meta tag generation</li>
                  <li>• Structured data markup</li>
                  <li>• Internal linking</li>
                  <li>• Content optimization</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Content Enhancement</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Improve readability</li>
                  <li>• Enhance user experience</li>
                  <li>• Add conversion elements</li>
                  <li>• Optimize for engagement</li>
                  <li>• Maintain brand voice</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <Card className="bg-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl">The Systems Thinking Advantage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Most GenAI content tools generate content in isolation. Our systems thinking approach ensures:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Holistic Analysis:</strong> Content analyzed from multiple perspectives, not just keywords</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Root Cause Identification:</strong> Understands why content performs (or doesn't)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Integrated Solutions:</strong> Content works together as a system, not isolated pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Optimal Outcomes:</strong> Systems thinking + GenAI creates better results than either alone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Sustainable Results:</strong> Content that performs long-term, not quick fixes</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="text-center space-y-6 bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold">Ready to Automate Your Website Creation?</h2>
            <p className="text-muted-foreground">
              Systems thinking + GenAI creates optimized websites automatically. Upload your content, 
              let our engine analyze and generate, then deploy your optimized website.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/pricing">Start Free Trial</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/systems-thinking">Learn About Systems Thinking</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Why It Works:</strong> Systems thinking + GenAI creates better results than GenAI alone. 
              Multi-perspective analysis ensures optimal website creation.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
