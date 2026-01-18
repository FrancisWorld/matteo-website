# Next Implementation Tasks - Matteo V2

This document outlines the **prioritized roadmap** to complete Matteo from 70% → 100%.

---

## Priority 1: Fix Critical Type Errors (Quick Wins)

### Task 1.1: Fix Blog Route Meta/Loader API
**File**: `src/routes/blog/index.tsx` + `src/routes/blog/$slug.tsx`

**Issue**: The `meta` property doesn't exist in TanStack Start's route config. Need to check current API.

**Action**:
1. Check if should use `beforeLoad` hook instead of `meta`
2. Consult `/tanstack/react-start` docs via context7 for proper SSR meta setup
3. Update blog routes to match current API

**Effort**: 30 minutes

---

### Task 1.2: Fix Form Labels & Accessibility
**File**: `src/routes/blog/new.tsx`

**Issue**: Labels not associated with inputs (missing `htmlFor` attribute).

**Fix**:
```tsx
// Line 78
- <Label>Email</Label>
+ <Label htmlFor="email">Email</Label>
- <Input type="email" />
+ <Input id="email" type="email" />
```

Apply to all form fields: Email, Title, Excerpt, Content.

**Effort**: 15 minutes

---

### Task 1.3: Replace Array Index Keys
**Files**: `src/routes/blog/index.tsx`, `src/routes/blog/$slug.tsx`

**Issue**: Using array index as React key.

**Fix**:
```tsx
// Line 28 in index.tsx
- {posts.map((post) => (
+ {posts.map((post) => (
-   <Link key={i} ...>
+   <Link key={post._id} ...>

// Line 83 in $slug.tsx
- {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
+ {paragraphs.map((p) => <p key={p.id || crypto.randomUUID()}>{p}</p>)}
```

**Effort**: 20 minutes

---

## Priority 2: Phase 3 Blog Enhancements

### Task 2.1: Implement Blog Pagination
**File**: `src/routes/blog/index.tsx`

**Current State**:
```typescript
const posts = useQuery(api.posts.list, { limit: 20 });
```
Shows all posts without pagination controls.

**Required Changes**:

1. **Add State**:
```typescript
const [page, setPage] = useState(1);
const postsPerPage = 10;
const offset = (page - 1) * postsPerPage;

const posts = useQuery(api.posts.list, { 
  limit: postsPerPage, 
  offset: offset 
});
const totalCount = useQuery(api.posts.count, {});
```

2. **Update Convex Backend** (`convex/posts.ts`):
```typescript
export const list = query({
  args: { limit: v.number(), offset: v.number() },
  handler: async (ctx, { limit, offset }) => {
    return await ctx.db
      .query("posts")
      .order("desc")
      .skip(offset)
      .take(limit)
      .collect();
  },
});

export const count = query({
  handler: async (ctx) => {
    return await ctx.db.query("posts").collect().length;
  },
});
```

3. **Add UI**:
```typescript
const totalPages = Math.ceil((totalCount || 0) / postsPerPage);
return (
  <>
    {/* Existing grid */}
    <div className="flex justify-between items-center mt-8">
      <PixelButton 
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
      >
        ← PREVIOUS
      </PixelButton>
      <span className="font-pixel">{page} / {totalPages}</span>
      <PixelButton 
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
      >
        NEXT →
      </PixelButton>
    </div>
  </>
);
```

**Effort**: 1-2 hours (includes backend update)

---

### Task 2.2: Create Per-User Blog Routes
**Files to Create**: 
- `src/routes/user/$username/blog.tsx`
- `src/routes/user/$username/blog/$slug.tsx`

**Implementation**:

1. **Create User Blog Index**:
```typescript
// src/routes/user/$username/blog.tsx
export const Route = createFileRoute('/user/$username/blog')({
  component: UserBlogIndex,
});

function UserBlogIndex() {
  const { username } = Route.useParams();
  const user = useQuery(api.users.getByUsername, { username });
  const posts = useQuery(api.posts.listByAuthor, { 
    authorId: user?.id,
    limit: 20 
  });
  // ... render blog grid
}
```

2. **Create User Blog Detail**:
```typescript
// src/routes/user/$username/blog/$slug.tsx
export const Route = createFileRoute('/user/$username/blog/$slug')({
  component: UserBlogDetail,
});
```

3. **Update Convex** (`convex/posts.ts`):
```typescript
export const listByAuthor = query({
  args: { authorId: v.string(), limit: v.number() },
  handler: async (ctx, { authorId, limit }) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", authorId))
      .order("desc")
      .take(limit)
      .collect();
  },
});
```

4. **Add User Functions** (`convex/users.ts` - create if missing):
```typescript
export const getByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), username))
      .first();
  },
});
```

**Effort**: 2-3 hours

---

## Priority 3: Phase 4 Quiz System

### Task 3.1: Add Quiz Schema
**File**: `convex/schema.ts`

**Add Tables**:
```typescript
quizzes: defineTable({
  title: v.string(),
  description: v.optional(v.string()),
  coverImage: v.optional(v.string()),
  authorId: v.string(),
  difficulty: v.enum("easy", "medium", "hard"),
  timeLimit: v.optional(v.number()), // seconds
  questions: v.array(v.object({
    id: v.string(),
    question: v.string(),
    answers: v.array(v.string()),
    correctAnswerIndex: v.number(),
    explanation: v.optional(v.string()),
  })),
  createdAt: v.number(),
  updatedAt: v.number(),
})
.index("by_author", ["authorId"]),

quizResults: defineTable({
  quizId: v.id("quizzes"),
  userId: v.optional(v.string()),
  score: v.number(),
  totalQuestions: v.number(),
  answers: v.array(v.object({
    questionId: v.string(),
    selectedAnswerIndex: v.number(),
    isCorrect: v.boolean(),
  })),
  completedAt: v.number(),
  shareToken: v.string(), // e.g., "abc123xyz"
})
.index("by_quiz", ["quizId"])
.index("by_user", ["userId"])
.index("by_share_token", ["shareToken"]),
```

**Effort**: 30 minutes

---

### Task 3.2: Implement Quiz Backend
**File to Create**: `convex/quizzes.ts`

```typescript
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    difficulty: v.enum("easy", "medium", "hard"),
    timeLimit: v.optional(v.number()),
    questions: v.array(v.object({
      id: v.string(),
      question: v.string(),
      answers: v.array(v.string()),
      correctAnswerIndex: v.number(),
      explanation: v.optional(v.string()),
    })),
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quizzes", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const get = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, { quizId }) => {
    return await ctx.db.get(quizId);
  },
});

export const list = query({
  args: { limit: v.number(), offset: v.number() },
  handler: async (ctx, { limit, offset }) => {
    return await ctx.db
      .query("quizzes")
      .order("desc")
      .skip(offset)
      .take(limit)
      .collect();
  },
});

export const submitResult = mutation({
  args: {
    quizId: v.id("quizzes"),
    userId: v.optional(v.string()),
    answers: v.array(v.object({
      questionId: v.string(),
      selectedAnswerIndex: v.number(),
    })),
  },
  handler: async (ctx, { quizId, userId, answers }) => {
    const quiz = await ctx.db.get(quizId);
    if (!quiz) throw new Error("Quiz not found");

    // Calculate score
    let correctCount = 0;
    const scoredAnswers = answers.map((ans) => {
      const question = quiz.questions.find((q) => q.id === ans.questionId);
      const isCorrect = question?.correctAnswerIndex === ans.selectedAnswerIndex;
      if (isCorrect) correctCount++;
      return { ...ans, isCorrect };
    });

    const shareToken = Math.random().toString(36).substring(2, 9);
    return await ctx.db.insert("quizResults", {
      quizId,
      userId,
      score: correctCount,
      totalQuestions: answers.length,
      answers: scoredAnswers,
      completedAt: Date.now(),
      shareToken,
    });
  },
});

export const getResultByToken = query({
  args: { shareToken: v.string() },
  handler: async (ctx, { shareToken }) => {
    return await ctx.db
      .query("quizResults")
      .withIndex("by_share_token", (q) => q.eq("shareToken", shareToken))
      .first();
  },
});
```

**Effort**: 1.5 hours

---

### Task 3.3: Create Quiz Routes
**Files to Create**:
- `src/routes/quiz/index.tsx` — List quizzes
- `src/routes/quiz/$id.tsx` — Play quiz
- `src/routes/quiz/results/$shareToken.tsx` — Share results

#### Route 3.3a: Quiz Index
```typescript
// src/routes/quiz/index.tsx
export const Route = createFileRoute('/quiz/')({
  component: QuizIndex,
});

function QuizIndex() {
  const quizzes = useQuery(api.quizzes.list, { 
    limit: 20, 
    offset: 0 
  });
  
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-pixel">QUIZZES</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {quizzes?.map((quiz) => (
          <Link key={quiz._id} to="/quiz/$id" params={{ id: quiz._id }}>
            <PixelCard hoverEffect>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-pixel">{quiz.title}</h2>
                <span className="font-pixel text-sm px-2 py-1 bg-primary/20">
                  {quiz.difficulty?.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{quiz.description}</p>
              <div className="text-sm font-body text-gray-500">
                {quiz.questions.length} questions
              </div>
            </PixelCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

#### Route 3.3b: Quiz Player
```typescript
// src/routes/quiz/$id.tsx
export const Route = createFileRoute('/quiz/$id')({
  component: QuizPlayer,
});

function QuizPlayer() {
  const { id } = Route.useParams();
  const quiz = useQuery(api.quizzes.get, { quizId: id });
  const submitResult = useMutation(api.quizzes.submitResult);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  if (!quiz) return <div>Loading...</div>;
  
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const question = quiz.questions[currentQuestion];
  
  return (
    <div className="space-y-8">
      {/* Header with title and progress */}
      <div>
        <h1 className="text-3xl font-pixel mb-4">{quiz.title}</h1>
        <div className="w-full bg-muted h-4 border-2 border-foreground">
          <div 
            className="bg-primary h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm font-body text-gray-400 mt-2">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
      </div>
      
      {/* Question Display */}
      <PixelCard className="p-8">
        <h2 className="text-2xl font-pixel mb-6">{question.question}</h2>
        <div className="space-y-4">
          {question.answers.map((answer, idx) => (
            <button
              key={idx}
              onClick={() => setAnswers({
                ...answers,
                [question.id]: idx
              })}
              className={cn(
                "w-full p-4 text-left border-2 font-body transition-colors",
                answers[question.id] === idx
                  ? "bg-primary border-foreground text-white"
                  : "bg-muted border-foreground text-foreground hover:bg-muted/80"
              )}
            >
              {answer}
            </button>
          ))}
        </div>
      </PixelCard>
      
      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <PixelButton
          onClick={() => setCurrentQuestion(q => Math.max(0, q - 1))}
          disabled={currentQuestion === 0}
        >
          ← BACK
        </PixelButton>
        
        {currentQuestion === quiz.questions.length - 1 ? (
          <PixelButton
            onClick={async () => {
              const result = await submitResult.mutate({
                quizId: id,
                userId: undefined, // Get from auth context
                answers: quiz.questions.map((q) => ({
                  questionId: q.id,
                  selectedAnswerIndex: answers[q.id] || 0,
                })),
              });
              navigate({ to: `/quiz/results/${result.shareToken}` });
            }}
          >
            SUBMIT QUIZ
          </PixelButton>
        ) : (
          <PixelButton
            onClick={() => setCurrentQuestion(q => q + 1)}
          >
            NEXT →
          </PixelButton>
        )}
      </div>
    </div>
  );
}
```

#### Route 3.3c: Quiz Results
```typescript
// src/routes/quiz/results/$shareToken.tsx
export const Route = createFileRoute('/quiz/results/$shareToken')({
  head: ({ loaderData }) => ({
    meta: [
      { title: `Quiz Result: ${loaderData?.score}/${loaderData?.totalQuestions}` },
      { 
        property: "og:title",
        content: `I scored ${loaderData?.score}/${loaderData?.totalQuestions} on a Minecraft quiz!`
      },
      {
        property: "og:description",
        content: "Take the quiz and see how you score. Join the Matteo community!"
      },
      {
        property: "og:image",
        content: "https://matteo.example.com/og-quiz.png"
      },
    ],
  }),
  component: QuizResults,
});

function QuizResults() {
  const { shareToken } = Route.useParams();
  const result = useQuery(api.quizzes.getResultByToken, { shareToken });
  
  if (!result) return <div>Result not found</div>;
  
  const percentage = (result.score / result.totalQuestions) * 100;
  
  return (
    <div className="space-y-8 text-center">
      <h1 className="text-5xl font-pixel">RESULTS</h1>
      
      <PixelCard className="p-8 text-center">
        <h2 className="text-4xl font-pixel mb-4 text-primary">
          {result.score} / {result.totalQuestions}
        </h2>
        <p className="text-2xl font-pixel mb-4">{percentage.toFixed(0)}%</p>
        <p className="text-lg font-body text-gray-400">
          {percentage >= 80 ? "Outstanding! 🎉" : "Good try! Keep going! 💪"}
        </p>
      </PixelCard>
      
      {/* Answer Breakdown */}
      <div className="space-y-4">
        {result.answers.map((ans, i) => (
          <PixelCard 
            key={i}
            className={cn(
              "p-4",
              ans.isCorrect ? "border-primary" : "border-destructive"
            )}
          >
            <div className="flex items-center gap-2">
              <span>{ans.isCorrect ? "✅" : "❌"}</span>
              <p className="font-body">Question {i + 1}</p>
            </div>
          </PixelCard>
        ))}
      </div>
      
      {/* Share Buttons */}
      <div className="flex justify-center gap-4">
        <PixelButton onClick={() => {
          const url = `https://matteo.example.com/quiz/results/${shareToken}`;
          navigator.clipboard.writeText(url);
        }}>
          COPY LINK
        </PixelButton>
        <PixelButton variant="secondary">
          RETRY QUIZ
        </PixelButton>
      </div>
    </div>
  );
}
```

**Effort**: 3-4 hours

---

## Implementation Order (Recommended)

### Week 1: Fix & Enhance Phase 3
1. **Day 1**: Fix type errors (Tasks 1.1-1.3) — **2 hours**
2. **Day 2-3**: Implement blog pagination (Task 2.1) — **2 hours**
3. **Day 3-4**: Create per-user blog routes (Task 2.2) — **3 hours**

### Week 2: Build Phase 4
1. **Day 1**: Quiz schema (Task 3.1) — **1 hour**
2. **Day 2**: Quiz backend (Task 3.2) — **2 hours**
3. **Day 3-5**: Quiz routes & UI (Task 3.3) — **4 hours**

### Week 3: Polish & Testing
- E2E testing with browser
- Verify SSR hydration
- Test auth flow with quizzes
- Optimize performance

---

## Estimated Timeline

| Task | Effort | Total |
|------|--------|-------|
| Fix Type Errors | 1 hour | 1h |
| Blog Pagination | 2 hours | 3h |
| User Blog Routes | 3 hours | 6h |
| Quiz Schema | 1 hour | 7h |
| Quiz Backend | 2 hours | 9h |
| Quiz Routes/UI | 4 hours | 13h |
| **Total** | | **~13-15 hours** |

**Result**: **100% Complete Matteo V2** in 2-3 weeks

---

## Notes

- All tasks follow the Minecraft Web Design System aesthetic
- Use Framer Motion for animations with `ease: "linear"` or `steps()`
- All routes must be SSR-compatible with proper `meta` tags
- Use Convex queries/mutations for all backend operations
- Maintain type safety—no `as any` or `@ts-ignore`

---

## Success Criteria

✅ All type errors resolved  
✅ Blog pagination working with Previous/Next buttons  
✅ Per-user blog URLs accessible and functional  
✅ Quiz system fully implemented with player and results  
✅ Shareable quiz results with proper OG tags  
✅ All routes SSR-capable and rendering correctly  
✅ E2E testing passes in browser  
✅ Build completes without errors  

---

**Ready to start? Pick a task above and begin implementation!**
