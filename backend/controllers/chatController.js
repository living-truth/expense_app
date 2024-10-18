const fs = require("fs").promises;
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const getMimeType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.pdf':
      return 'application/pdf';
    case '.doc':
    case '.docx':
      return 'application/msword';
    default:
      return 'application/octet-stream';
  }
};

exports.sendMessage = async (req, res) => {
  console.log('Request received:', new Date().toISOString());
  console.log('Request Body:', req.body);
  console.log('Request Files:', req.files);

  let prompt = req.body.prompt || '';
  let fileObjects = [];

  console.log('Initial fileObjects:', fileObjects);

  if (req.files && req.files.length > 0) {
    console.log('Files detected. Processing...');
    try {
      fileObjects = await Promise.all(req.files.map(async file => {
        const filePath = path.join(__dirname, "../", 'uploads', file.filename);
        const content = await fs.readFile(filePath);
        return { 
          file: content, 
          filename: file.originalname,
          mimeType: getMimeType(file.originalname)
        };
      }));
      console.log('File processing complete. fileObjects:', fileObjects);
    } catch (error) {
      console.error('Error processing files:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error reading the uploaded file',
      });
    }
  } else {
    console.log('No files detected in the request.');
  }

  console.log('fileObjects before API call:', fileObjects);

  if (prompt.trim() || fileObjects.length > 0) {
    try {
      console.log('Sending request to Anthropic:', new Date().toISOString());

      const messageContent = [
        { type: "text", text: prompt.trim() },
        ...(Array.isArray(fileObjects) && fileObjects.length > 0 ? fileObjects.map(file => ({
          type: file.mimeType.startsWith('image/') ? "image" : "file",
          source: {
            type: "base64",
            media_type: file.mimeType,
            data: file.file.toString('base64')
          }
        })) : [])
      ];

      console.log('Message content structure:', JSON.stringify(messageContent, null, 2));

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: messageContent
          }
        ]
      });

      console.log('Response received from Anthropic:', new Date().toISOString());
      console.log('AI response:', response.content[0].text.substring(0, 200) + '...');

      // Clean up uploaded files
      if (req.files) {
        await Promise.all(req.files.map(file => 
          fs.unlink(path.join(__dirname, "../", 'uploads', file.filename))
        ));
      }

      return res.status(200).json({
        success: true,
        message: response.content[0].text,
      });
    } catch (error) {
      console.error('Error occurred:', error);
      return res.status(501).json({
        status: 'error',
        message: 'Error occurred while processing your request',
      });
    }
  } else {
    return res.status(400).json({
      status: 'error',
      message: 'No prompt or files provided',
    });
  }
}