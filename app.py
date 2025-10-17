# app.py
import os
from config import DATABASE_NAME
from database import Database
from flask_cors import CORS
from flask import Flask, jsonify, request, send_from_directory
from dotenv import load_dotenv
load_dotenv()  # Load .env file


app = Flask(__name__, static_folder='frontend/dist')
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize database
db = Database(DATABASE_NAME)

# Test endpoint


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'API is running'})

# Get user folders


@app.route('/api/folders/<int:user_id>', methods=['GET'])
def get_folders(user_id):
    """Get all folders for a user"""
    try:
        folders = db.get_user_folders(user_id)

        # Format response
        folders_data = []
        for folder_id, folder_name, created_at, file_count in folders:
            folders_data.append({
                'id': folder_id,
                'name': folder_name,
                'file_count': file_count,
                'created_at': created_at
            })

        return jsonify({
            'success': True,
            'folders': folders_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Get files in a folder


@app.route('/api/folders/<int:folder_id>/files', methods=['GET'])
def get_folder_files(folder_id):
    """Get all files in a folder"""
    try:
        files = db.get_folder_files(folder_id)

        # Format response
        files_data = []
        for file_db_id, file_id, file_name, file_type, file_size, uploaded_at in files:
            files_data.append({
                'id': file_db_id,
                'telegram_file_id': file_id,
                'name': file_name,
                'type': file_type,
                'size': file_size,
                'uploaded_at': uploaded_at
            })

        return jsonify({
            'success': True,
            'files': files_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Delete file


@app.route('/api/files/<int:file_id>', methods=['DELETE'])
def delete_file(file_id):
    """Delete a file"""
    try:
        db.delete_file(file_id)
        return jsonify({
            'success': True,
            'message': 'File deleted successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Delete folder


@app.route('/api/folders/<int:folder_id>', methods=['DELETE'])
def delete_folder(folder_id):
    """Delete a folder and all its files"""
    try:
        db.delete_folder(folder_id)
        return jsonify({
            'success': True,
            'message': 'Folder deleted successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Get user stats


@app.route('/api/stats/<int:user_id>', methods=['GET'])
def get_stats(user_id):
    """Get user storage statistics"""
    try:
        stats = db.get_user_stats(user_id)
        return jsonify({
            'success': True,
            'stats': stats
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Serve React app (for production)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """Serve React frontend"""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    
    print("🚀 Flask API Server Starting...")
    print("📊 API Endpoints:")
    print("   - GET  /api/health")
    print("   - GET  /api/folders/<user_id>")
    print("   - GET  /api/folders/<folder_id>/files")
    print("   - DELETE /api/files/<file_id>")
    print("   - DELETE /api/folders/<folder_id>")
    print("   - GET  /api/stats/<user_id>")
    print(f"\n🌐 Server running on port {port}")
    
    app.run(host='0.0.0.0', port=port, debug=False)
