// "use client";

// import { useState, useEffect, FormEvent, useRef } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// interface ChatMessage {
//   id: number;
//   message: string;
//   is_bot: boolean;
//   timestamp: string;
// }

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default function ChatWithUpload() {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const chatEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const response = await api.get("https://django-backend1-777268942678.asia-south2.run.app/api/chat/history");
//         setMessages(response.data);
//       } catch (error) {
//         console.error("Failed to fetch chat history:", error);
//         if ((error as any).response?.status === 401) {
//           router.push("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHistory();
//   }, [router]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = input;
//     setInput("");

//     try {
//       const userMsgResponse = await api.post("https://django-backend1-777268942678.asia-south2.run.app/api/chat/save", {
//         message: userMessage,
//         is_bot: false,
//       });
//       setMessages((prev) => [...prev, userMsgResponse.data]);

//       const botMessage = `Echo: ${userMessage}`;
//       const botMsgResponse = await api.post("https://django-backend1-777268942678.asia-south2.run.app/api/chat/save", {
//         message: botMessage,
//         is_bot: true,
//       });
//       setMessages((prev) => [...prev, botMsgResponse.data]);
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       alert("Could not send message. Please try again.");
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;

//     try {
//     //   const tokenRes = await api.get("https://django-backend1-777268942678.asia-south2.run.app/api/get-gcp-token");
//     //   const { access_token } = tokenRes.data;

//       const uploadRes = await fetch(
//         `https://storage.googleapis.com/spastha-final-bucket/${file.name}`,
//         {
//           method: "POST",
//           headers: {
//             // Authorization: `Bearer ${access_token}`,
//             "Content-Type": file.type,
//           },
//           body: file,
//         }
//       );

//       if (uploadRes.ok) {
//         alert("Upload successful!");
//       } else {
//         alert("Upload failed");
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Upload failed due to an error.");
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading chat...</div>;
//   }

//   return (
//     <div className="flex flex-col h-screen max-w-3xl mx-auto bg-white shadow-lg">
//       <header className="p-4 border-b flex justify-between items-center">
//         <h1 className="text-xl font-bold">Spasht Chat</h1>
//         <div className="flex items-center gap-2">
//           <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
//           <button
//             onClick={handleUpload}
//             className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//           >
//             Upload
//           </button>
//         </div>
//       </header>

//       <main className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`flex ${msg.is_bot ? "justify-start" : "justify-end"}`}>
//             <div
//               className={`max-w-xs md:max-w-md p-3 rounded-lg ${
//                 msg.is_bot ? "bg-gray-200" : "bg-blue-500 text-white"
//               }`}
//             >
//               <p>{msg.message}</p>
//             </div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </main>

//       <footer className="p-4 border-t">
//         <form onSubmit={handleSendMessage} className="flex gap-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Send
//           </button>
//         </form>
//       </footer>
//     </div>
//   );
// }


// app/page.tsx or app/your-route/page.tsx

"use client";
import React, { useState, ChangeEvent } from 'react';

// The URL of your public Google Cloud Storage bucket
const BUCKET_URL = 'https://storage.googleapis.com/spastha-final-bucket/';

// Define the component's props if needed (none for this example)
interface FileUploadProps {}

// The component function for the page, exported as a default.
export default function Page() {
  // State to hold the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // State to manage the upload status for the UI
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Handles the file selection from the input element
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle'); // Reset status if a new file is chosen
      setStatusMessage(file.name);
    }
  };

  // Handles the file upload logic when the button is clicked
  const handleUpload = async () => {
    if (!selectedFile) {
      setStatusMessage('Please select a file first.');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setStatusMessage(`Uploading ${selectedFile.name}...`);

    const formData = new FormData();
    formData.append('key', selectedFile.name);
    formData.append('file', selectedFile);

    try {
      const response = await fetch(BUCKET_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('success');
        setStatusMessage('Upload successful! Please wait 1-3 minutes for processing.');
      } else {
        const errorText = await response.text();
        setUploadStatus('error');
        setStatusMessage(`Upload failed: ${response.statusText}`);
        console.error('GCS Upload Error:', errorText);
      }
    } catch (error) {
      setUploadStatus('error');
      setStatusMessage('A network error occurred. Please try again.');
      console.error('Network Error:', error);
    }
  };

  return (
    <div>
      <h2>Upload Legal Document</h2>
      <p>Select a PDF file to upload for analysis.</p>
      
      <input 
        type="file" 
        accept=".pdf" 
        onChange={handleFileChange} 
      />
      
      <button 
        onClick={handleUpload} 
        disabled={!selectedFile || uploadStatus === 'uploading'}
      >
        {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload File'}
      </button>

      {statusMessage && (
        <p style={{ 
          color: uploadStatus === 'error' ? 'red' : (uploadStatus === 'success' ? 'green' : 'black') 
        }}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};
