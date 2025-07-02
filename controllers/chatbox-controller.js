export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Basic chatbox logic with navigation suggestions and links
    const lowerMessage = message.toLowerCase();

    let responseMessage = "Sorry, I didn't understand that. Can you please rephrase?";
    let navigateTo = null;

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      responseMessage = "Hello! How can I assist you today?";
    } else if (lowerMessage.includes("movie") || lowerMessage.includes("show")) {
      responseMessage = "You can browse movies on the home page (click the link below) or use the search bar to find specific titles.";
      navigateTo = "/";
    } else if (lowerMessage.includes("booking")) {
      responseMessage = "To book a movie ticket, select a movie and choose your seats.";
      navigateTo = "/newBooking";
    }  else if (lowerMessage.includes("help")) {
      responseMessage = "I'm here to help! Ask me about movies, bookings, or your account.";
    } else if (lowerMessage.includes("profile") || lowerMessage.includes("account") || lowerMessage.includes("login")) {
      responseMessage = "You can view and edit your profile here.";
      navigateTo = "/login";
    } else if (lowerMessage.includes("admin")) {
      responseMessage = "Admin dashboard is available here.";
      navigateTo = "/admin";
    } else if (lowerMessage.includes("thank")) {
      responseMessage = "You're welcome! If you have more questions, feel free to ask.";
    }

    return res.status(200).json({ reply: responseMessage, navigateTo });
  } catch (error) {
    console.error("Chatbox error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// chatController.js (or wherever your chat logic lives)
