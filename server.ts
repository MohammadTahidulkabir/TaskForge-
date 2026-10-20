import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('[Server] GEMINI_API_KEY is not defined. Server will use heuristic fallback responses for AI planning.');
}

// -------------------------------------------------------------
// API Route: Natural Language Task Extraction
// -------------------------------------------------------------
app.post('/api/gemini/natural-parse', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Input text is required' });
    }

    if (!ai) {
      // High-quality heuristic fallback
      const lower = input.toLowerCase();
      let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
      if (lower.includes('urgent') || lower.includes('asap')) priority = 'urgent';
      else if (lower.includes('high') || lower.includes('important')) priority = 'high';
      else if (lower.includes('low') || lower.includes('someday')) priority = 'low';

      let category: 'university' | 'research' | 'coding' | 'personal' | 'other' = 'coding';
      if (lower.includes('lab') || lower.includes('exam') || lower.includes('class') || lower.includes('hw') || lower.includes('homework') || lower.includes('assignment')) category = 'university';
      else if (lower.includes('paper') || lower.includes('literature') || lower.includes('arxiv') || lower.includes('experiment') || lower.includes('dataset')) category = 'research';
      else if (lower.includes('gym') || lower.includes('buy') || lower.includes('clean') || lower.includes('doctor')) category = 'personal';

      const today = new Date().toISOString().split('T')[0];
      return res.json({
        title: input.slice(0, 80),
        description: input,
        category,
        priority,
        dueDate: today,
        dueTime: '17:00',
        estimatedMinutes: 60,
        subtasks: ['Review guidelines', 'Draft core solution', 'Run tests and verify'],
        isFallback: true,
      });
    }

    const todayDate = new Date().toISOString().split('T')[0];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Parse this natural language task request into a structured task object. Today's date is ${todayDate}.
Text: "${input}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Concise actionable title' },
            description: { type: Type.STRING, description: 'Optional additional context or notes' },
            category: { 
              type: Type.STRING, 
              enum: ['university', 'research', 'coding', 'personal', 'other'],
              description: 'Appropriate category' 
            },
            priority: { 
              type: Type.STRING, 
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Assessed priority level' 
            },
            dueDate: { type: Type.STRING, description: 'Target due date in YYYY-MM-DD format' },
            dueTime: { type: Type.STRING, description: 'Target due time in 24-hr HH:mm format, or empty string' },
            estimatedMinutes: { type: Type.INTEGER, description: 'Realistic estimated minutes needed (e.g. 30, 45, 90)' },
            subtasks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: '2 to 4 recommended first actionable sub-steps' 
            },
          },
          required: ['title', 'category', 'priority', 'dueDate', 'estimatedMinutes', 'subtasks'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in natural-parse:', error);
    return res.status(500).json({ error: error.message || 'Failed to parse task with AI' });
  }
});

// -------------------------------------------------------------
// API Route: Task Subtask Decomposition
// -------------------------------------------------------------
app.post('/api/gemini/breakdown-task', async (req, res) => {
  try {
    const { title, description, category, estimatedMinutes } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    if (!ai) {
      return res.json({
        subtasks: [
          { title: `Prepare prerequisites and setup for ${title}`, estimatedMinutes: Math.round((estimatedMinutes || 60) * 0.25) },
          { title: `Core implementation and problem solving`, estimatedMinutes: Math.round((estimatedMinutes || 60) * 0.5) },
          { title: `Testing, documentation, and review`, estimatedMinutes: Math.round((estimatedMinutes || 60) * 0.25) },
        ],
        tips: 'Plan short focus intervals and take a 5-minute break between major milestones.',
        isFallback: true,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Break down the following task into 3-6 concrete, sequential, actionable subtasks suitable for an engineering student or developer.
Task Title: ${title}
Description: ${description || 'N/A'}
Category: ${category || 'general'}
Estimated Total Duration: ${estimatedMinutes || 60} minutes`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Actionable subtask name' },
                  estimatedMinutes: { type: Type.INTEGER, description: 'Duration in minutes' },
                },
                required: ['title', 'estimatedMinutes'],
              },
            },
            tips: { type: Type.STRING, description: 'Short tactical execution advice or reminder' },
          },
          required: ['subtasks', 'tips'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in breakdown-task:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate subtask breakdown' });
  }
});

// -------------------------------------------------------------
// API Route: Intelligent Daily Schedule Planner
// -------------------------------------------------------------
app.post('/api/gemini/plan-schedule', async (req, res) => {
  try {
    const { tasks, workStartHour = 9, workEndHour = 18, dailyCapacityMinutes = 360, date } = req.body;
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: 'Tasks array is required' });
    }

    if (!ai) {
      // Intelligent heuristic schedule generator
      let currentHour = workStartHour;
      let currentMinute = 0;

      const sorted = [...tasks].sort((a, b) => {
        const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
      });

      const scheduledTasks = sorted.map((task) => {
        const startStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        const duration = task.estimatedMinutes || 45;
        currentMinute += duration;
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
        const endStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

        return {
          id: task.id,
          title: task.title,
          startTime: startStr,
          endTime: endStr,
          reason: `Scheduled based on ${task.priority} priority and ${duration}m estimated workload.`,
        };
      });

      return res.json({
        schedule: scheduledTasks,
        recommendations: [
          'High-priority engineering items scheduled during your peak morning energy window.',
          'Built-in buffer intervals between tasks to avoid context switching fatigue.',
          'Review your progress mid-day and adjust remaining blocks accordingly.',
        ],
        warnings: currentHour > workEndHour ? ['Schedule extends past target working hours. Consider deferring low-priority tasks.'] : [],
        isFallback: true,
      });
    }

    const taskSummaries = tasks.map((t: any) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      category: t.category,
      estimatedMinutes: t.estimatedMinutes || 45,
      dueDate: t.dueDate,
      dueTime: t.dueTime,
      status: t.status,
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an elite productivity architect for software engineers and university researchers.
Target Planning Date: ${date || 'Today'}
Working Hours: ${workStartHour}:00 to ${workEndHour}:00 (${(workEndHour - workStartHour) * 60} max available minutes)
Daily Target Focus Capacity: ${dailyCapacityMinutes} minutes
Active Tasks to Schedule:
${JSON.stringify(taskSummaries, null, 2)}

Create an optimal, realistic time-blocked schedule. Place urgent and cognitively heavy tasks (coding, lab research) early. Insert 10-15m cognitive breathing room between intense blocks. Detect any deadline conflicts or overload situations.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Task ID matching the input' },
                  title: { type: Type.STRING },
                  startTime: { type: Type.STRING, description: 'HH:mm format (e.g. 09:30)' },
                  endTime: { type: Type.STRING, description: 'HH:mm format (e.g. 10:45)' },
                  reason: { type: Type.STRING, description: 'Strategic rationale for this placement' },
                },
                required: ['id', 'title', 'startTime', 'endTime', 'reason'],
              },
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 actionable productivity strategies for this schedule',
            },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Any schedule bottlenecks, overruns, or conflicting deadlines',
            },
          },
          required: ['schedule', 'recommendations', 'warnings'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in plan-schedule:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate schedule with AI' });
  }
});

// -------------------------------------------------------------
// API Route: AI Daily Standup & Productivity Brief
// -------------------------------------------------------------
app.post('/api/gemini/daily-summary', async (req, res) => {
  try {
    const { completedCount, pendingCount, overdueCount, topCategories, journalNotes } = req.body;

    if (!ai) {
      return res.json({
        summary: `You completed ${completedCount} tasks today with ${pendingCount} remaining. Steady focus maintained across ${topCategories?.join(', ') || 'key areas'}.`,
        keyWins: ['Strong forward progress on daily technical deliverables', 'Consistent task closure rate'],
        tomorrowAdvice: 'Tackle the most complex overdue or pending task first before checking communications.',
        isFallback: true,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Provide an encouraging, analytical engineering daily standup summary.
Tasks Completed: ${completedCount}
Tasks Pending: ${pendingCount}
Overdue Count: ${overdueCount}
Active Domains: ${JSON.stringify(topCategories || [])}
Developer Notes: ${journalNotes || 'None logged today'}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: '2-3 sentence executive debrief' },
            keyWins: { type: Type.ARRAY, items: { type: Type.STRING } },
            tomorrowAdvice: { type: Type.STRING, description: 'One specific tactical focus for tomorrow' },
          },
          required: ['summary', 'keyWins', 'tomorrowAdvice'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in daily-summary:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate daily summary' });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving Setup
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TaskForge AI] Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[TaskForge AI] Failed to start server:', err);
  process.exit(1);
});
