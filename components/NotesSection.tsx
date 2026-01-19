import React, { useState } from 'react';
import { Note } from '../types';
import { MessageSquarePlus, Send, Calendar, User, Trash2, Mail, Loader2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { generateNotesEmailBody } from '../lib/exports';

interface NotesSectionProps {
  monthId: string;
  monthName: string;
  notes: Note[];
  onAddNote: (monthId: string, content: string, userName: string) => Promise<void>;
  onDeleteNote: (monthId: string, noteId: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ 
  monthId,
  monthName, 
  notes, 
  onAddNote,
  onDeleteNote 
}) => {
  const { isAdmin } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Email state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() || !userName.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNote(monthId, noteContent.trim(), userName.trim());
      setNoteContent('');
      setUserName('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Failed to add note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTo.trim() || sortedNotes.length === 0) return;

    setIsSendingEmail(true);
    try {
      const notesData = sortedNotes.map(n => ({
        content: n.content,
        userName: n.userName,
        createdAt: n.createdAt
      }));
      
      const htmlBody = generateNotesEmailBody(notesData, monthName);

      // Send email by POSTing to configured email function endpoint.
      const SEND_EMAIL_URL = import.meta.env.VITE_SEND_EMAIL_URL || '/api/send-email';

      const res = await fetch(SEND_EMAIL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailTo.trim(),
          subject: `📝 ${monthName} Notes - Physique 57 India`,
          html: htmlBody
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to send email');
      }

      setEmailSuccess(true);
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailTo('');
        setEmailSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort notes by date, newest first
  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquarePlus className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notes & Updates</h3>
          {sortedNotes.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {sortedNotes.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {sortedNotes.length > 0 && (
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
              title="Email notes"
            >
              <Mail className="w-4 h-4" />
              Email Notes
            </button>
          )}
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Add Note
            </button>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-purple-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-600" /> Email Notes
              </h3>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailTo('');
                  setEmailSuccess(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Send {sortedNotes.length} note(s) to:
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={isSendingEmail}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailTo('');
                  }}
                  disabled={isSendingEmail}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail || !emailTo.trim()}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    emailSuccess
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  } disabled:opacity-50`}
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : emailSuccess ? (
                    <>✓ Sent!</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Note Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add your note here..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting || !noteContent.trim() || !userName.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Send Note'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNoteContent('');
                  setUserName('');
                }}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquarePlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No notes yet. Add the first one!</p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`bg-gray-50 rounded-lg p-4 border border-gray-100 ${
                !isAdmin ? 'hidden' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-gray-900">{note.userName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(note.createdAt)}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => onDeleteNote(monthId, note.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>

      {!isAdmin && sortedNotes.length > 0 && (
        <div className="mt-4 text-xs text-gray-500 text-center italic">
          Notes are visible only to administrators
        </div>
      )}
    </div>
  );
};
