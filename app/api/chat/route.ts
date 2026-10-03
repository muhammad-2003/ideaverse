import { NextResponse } from 'next/server';
import {
  getAllThreads,
  getThreadById,
  createOrGetThread,
  sendMessage,
  markThreadRead,
  updateThreadStatus,
  deleteThread,
} from '@/lib/chat/service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');
    const markReadReader = searchParams.get('reader') as 'user' | 'admin' | null;

    if (threadId) {
      if (markReadReader) {
        markThreadRead(threadId, markReadReader);
      }
      const thread = getThreadById(threadId);
      if (!thread) {
        return NextResponse.json({ success: false, error: 'Chat thread not found' }, { status: 404 });
      }
      return NextResponse.json(
        { success: true, thread },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    const threads = getAllThreads();
    return NextResponse.json(
      { success: true, threads },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch chat data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'start') {
      const { userName, userEmail, userPhone, initialMessage } = body;
      if (!userName || !userEmail) {
        return NextResponse.json(
          { success: false, error: 'Name and email are required to start a chat.' },
          { status: 400 }
        );
      }
      const thread = createOrGetThread({ userName, userEmail, userPhone, initialMessage });
      return NextResponse.json({ success: true, thread });
    }

    if (action === 'send') {
      const { threadId, sender, senderName, message } = body;
      if (!threadId || !message || !sender) {
        return NextResponse.json(
          { success: false, error: 'Thread ID, sender, and message are required.' },
          { status: 400 }
        );
      }
      const result = sendMessage({
        threadId,
        sender,
        senderName: senderName || (sender === 'admin' ? 'IdeaVerse Desk' : 'Visitor'),
        message,
      });
      return NextResponse.json({ success: true, ...result });
    }

    if (action === 'mark_read') {
      const { threadId, reader } = body;
      if (!threadId || !reader) {
        return NextResponse.json(
          { success: false, error: 'Thread ID and reader are required.' },
          { status: 400 }
        );
      }
      const thread = markThreadRead(threadId, reader);
      return NextResponse.json({ success: true, thread });
    }

    if (action === 'status') {
      const { threadId, status } = body;
      if (!threadId || !status) {
        return NextResponse.json(
          { success: false, error: 'Thread ID and status are required.' },
          { status: 400 }
        );
      }
      const thread = updateThreadStatus(threadId, status);
      return NextResponse.json({ success: true, thread });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');

    if (!threadId) {
      return NextResponse.json(
        { success: false, error: 'Missing threadId' },
        { status: 400 }
      );
    }

    const deleted = deleteThread(threadId);
    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete chat thread' },
      { status: 500 }
    );
  }
}
