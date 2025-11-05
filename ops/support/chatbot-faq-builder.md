# Chatbot FAQ Builder

**Purpose:** Guide for creating and maintaining a chatbot FAQ system to handle common customer questions automatically, reducing support load.

## Overview

A well-built chatbot FAQ can handle 60-80% of common customer inquiries, freeing up support time for complex issues.

## Chatbot Platform Options

### Free/Low-Cost Options
1. **Crisp** (Free tier) - Built-in chatbot with FAQ
2. **Intercom** ($74/month) - Powerful but expensive
3. **Tidio** (Free tier) - Simple chatbot builder
4. **Chatbase** (Free tier) - AI-powered from your docs

### Custom Solutions
- **OpenAI GPT + Supabase** - Custom chatbot using your docs
- **LangChain + Vector DB** - Advanced AI chatbot
- **Dialogflow** (Google) - Free tier available

## FAQ Structure

### Categories

1. **Getting Started**
   - How do I sign up?
   - What do I need to get started?
   - How do I create my account?

2. **Account & Billing**
   - How do I change my password?
   - How do I update my payment method?
   - How do I cancel my subscription?
   - What payment methods do you accept?

3. **Features & Usage**
   - How do I use [feature X]?
   - Can I do [action Y]?
   - Where do I find [setting Z]?

4. **Technical Support**
   - Why can't I log in?
   - The site is slow, what should I do?
   - I'm getting an error message

5. **Pricing & Plans**
   - What's included in each plan?
   - Can I upgrade/downgrade?
   - Do you offer refunds?

6. **Privacy & Security**
   - How do you protect my data?
   - Can I export my data?
   - How do I delete my account?

## FAQ Content Template

### Question Format

**Question:** [Customer's exact wording]
**Answer:** [Clear, concise answer]
**Related Questions:** [Links to related FAQs]
**Tags:** [category, feature, keyword]

### Example FAQs

**Q: How do I reset my password?**
**A:** To reset your password:
1. Click "Forgot Password" on the login page
2. Enter your email address
3. Check your email for the reset link
4. Click the link and set a new password

If you don't receive the email, check your spam folder or contact support.

**Related:** [How do I change my password?] [I can't access my email]

**Tags:** account, password, login

---

**Q: What payment methods do you accept?**
**A:** We accept:
- Credit cards (Visa, Mastercard, American Express)
- Debit cards
- PayPal (coming soon)

All payments are processed securely through Stripe. We charge in CAD (Canadian Dollars).

**Related:** [How do I update my payment method?] [Do you offer refunds?]

**Tags:** billing, payment, pricing

---

**Q: Can I cancel my subscription anytime?**
**A:** Yes! You can cancel your subscription anytime:
1. Go to Settings → Billing
2. Click "Cancel Subscription"
3. Confirm cancellation

Your subscription will remain active until the end of your billing period. You won't be charged again, and you'll retain access until then.

**Related:** [How do I get a refund?] [What happens when I cancel?]

**Tags:** billing, subscription, cancel

---

**Q: How do I contact support?**
**A:** You can reach us:
- Email: support@yourdomain.com
- In-app chat: Click the chat icon (bottom right)
- Help center: [link to docs]

We typically respond within 24 hours. For urgent issues, use the in-app chat.

**Related:** [What are your support hours?] [How quickly do you respond?]

**Tags:** support, contact, help

## Building Your FAQ Database

### Step 1: Collect Questions

**Sources:**
- Support ticket history (most common questions)
- Customer interviews
- User testing sessions
- Social media mentions
- Competitor FAQs

**Tools:**
- Export support tickets
- Survey customers: "What questions do you have?"
- Review chat logs

### Step 2: Write Answers

**Guidelines:**
- Keep answers concise (2-3 sentences)
- Use simple language
- Include step-by-step instructions
- Add links to detailed docs
- Include examples where helpful

**Tone:**
- Friendly but professional
- Helpful and clear
- Avoid jargon
- Use "you" instead of "users"

### Step 3: Organize by Category

**Structure:**
```
Getting Started (5 FAQs)
├── How do I sign up?
├── What do I need to get started?
├── How do I create my account?
├── Is there a free trial?
└── How do I get help?

Account & Billing (8 FAQs)
├── How do I change my password?
├── How do I update payment method?
├── Can I cancel anytime?
└── ... (5 more)

Features & Usage (15 FAQs)
...
```

### Step 4: Add Keywords & Synonyms

**For each FAQ, include:**
- Primary keywords: password, reset, forgot
- Synonyms: change password, update password, new password
- Related terms: login, account, access

This helps the chatbot match user questions even if worded differently.

## Chatbot Setup (Crisp Example)

### 1. Create FAQ Database

**In Crisp:**
1. Go to Settings → Chatbot
2. Click "FAQ"
3. Add categories
4. Add questions and answers

### 2. Configure Triggers

**When to show chatbot:**
- Visitor lands on page
- Visitor hasn't interacted in 30 seconds
- Visitor scrolls to bottom of page
- Visitor clicks "Help" button

### 3. Set Up Escalation

**If chatbot can't answer:**
- Offer to connect with human agent
- Collect email for follow-up
- Suggest relevant documentation
- Create support ticket automatically

### 4. Train with Examples

**Provide example conversations:**
- "I forgot my password" → FAQ: "How do I reset my password?"
- "How much does it cost?" → FAQ: "What are your pricing plans?"
- "I want to cancel" → FAQ: "Can I cancel my subscription?"

## AI-Powered Chatbot (Advanced)

### Using OpenAI + Your Docs

**Setup:**
1. Create embeddings of your documentation
2. Store in Supabase vector database
3. Use OpenAI API to answer questions
4. Fallback to human if confidence low

**Example Implementation:**
```typescript
// Simplified example
async function answerQuestion(question: string) {
  // Search your docs for relevant content
  const relevantDocs = await searchDocs(question);
  
  // Use OpenAI to generate answer
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful support agent." },
      { role: "user", content: `Based on this: ${relevantDocs}, answer: ${question}` }
    ]
  });
  
  return response.choices[0].message.content;
}
```

### Using Chatbase

**Setup:**
1. Upload your documentation (PDFs, web pages)
2. Chatbase creates knowledge base
3. Embed chatbot widget on your site
4. Free tier: 20 messages/month

## Maintenance

### Weekly Review
- Check chatbot logs for unanswered questions
- Add new FAQs for common questions
- Update answers if product changes
- Test chatbot responses

### Monthly Updates
- Review most asked questions
- Remove outdated FAQs
- Improve answer quality
- Add new features to FAQ

### Analytics
- Track: Questions asked, Resolution rate, Escalation rate
- Identify: Unanswered questions, Low satisfaction interactions
- Improve: Add FAQs for common escalations

## Testing Checklist

- [ ] Test all FAQ questions
- [ ] Verify links work
- [ ] Check mobile responsiveness
- [ ] Test escalation flow
- [ ] Review answer quality
- [ ] Check for typos/grammar
- [ ] Verify tone consistency

## Best Practices

1. **Start Simple** - Begin with 10-20 most common questions
2. **Iterate** - Add FAQs based on real customer questions
3. **Keep Updated** - Update FAQs when product changes
4. **Make it Easy** - Simple language, clear instructions
5. **Track Performance** - Monitor what's working
6. **Human Handoff** - Always provide option to talk to human

## Resources

- Crisp FAQ Guide: https://help.crisp.chat/en/article/how-to-set-up-faqs-in-crisp-1w0jqxj/
- Intercom Bots: https://www.intercom.com/bots
- Chatbase: https://www.chatbase.co/

---

**Last Updated:** 2025-01-XX  
**Next Review:** Monthly
