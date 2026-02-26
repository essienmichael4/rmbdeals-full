import { AlertCircle, CheckCircle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  confirmText: string;
  isConfirmed: boolean;
  onConfirmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal = ({
  isOpen,
  confirmText,
  isConfirmed,
  onConfirmChange,
  onDelete,
  onCancel,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Confirm Account Deletion</h3>
          <p className="text-gray-600 text-center mb-6">
            This action cannot be undone. All your data will be permanently deleted.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <strong>"delete my account"</strong> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={onConfirmChange}
              placeholder="Type to confirm..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>

          {isConfirmed && (
            <div className="flex items-center gap-2 text-green-600 mb-4 text-sm">
              <CheckCircle size={18} />
              <span>Ready to delete</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              disabled={!isConfirmed}
              className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-colors ${
                isConfirmed
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
