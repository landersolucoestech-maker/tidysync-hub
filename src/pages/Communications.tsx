import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Search,
  MessageSquare,
  Star,
  Paperclip,
  Send,
  Smile,
  Menu,
  Trash2,
  Archive,
  Flag,
} from "lucide-react";

const conversationsData = [
  {
    id: 1,
    customer: "Charles Lewis",
    lastMessage: "Hi Charles Lewis! Your cleaning...",
    date: "12/27/25",
    unread: false,
    favorite: false,
  },
  {
    id: 2,
    customer: "Ariel Mack",
    lastMessage: "Hi Ariel Mack! Your cleaning is c...",
    date: "12/27/25",
    unread: true,
    favorite: false,
  },
  {
    id: 3,
    customer: "John Sukits (Need a key)",
    lastMessage: "Please tell the girls that I got the do...",
    date: "12/27/25",
    unread: true,
    favorite: true,
  },
  {
    id: 4,
    customer: "Ken Gilbert",
    lastMessage: "Im sorry about the delayed message...",
    date: "12/27/25",
    unread: false,
    favorite: false,
  },
  {
    id: 5,
    customer: "Mary Jenkins",
    lastMessage: "Hi Mary Jenkins! Your cleaning...",
    date: "12/27/25",
    unread: false,
    favorite: false,
  },
];

type FilterType = "all" | "unread" | "favorites";

export function Communications() {
  const [conversationSearch, setConversationSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");

  const filteredConversations = conversationsData.filter((conv) => {
    const matchesSearch = conv.customer.toLowerCase().includes(conversationSearch.toLowerCase());
    if (activeFilter === "unread") return matchesSearch && conv.unread;
    if (activeFilter === "favorites") return matchesSearch && conv.favorite;
    return matchesSearch;
  });

  const selectedConversationData = conversationsData.find(
    (conv) => conv.id === selectedConversation
  );

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  const handleAttachFile = () => {
    console.log("Attach file clicked");
  };

  const handleDeleteConversation = () => {
    console.log("Delete conversation:", selectedConversation);
  };

  const handleArchiveConversation = () => {
    console.log("Archive conversation:", selectedConversation);
  };

  const handleFlagConversation = () => {
    console.log("Flag conversation:", selectedConversation);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6 pl-[10px] pb-0 pr-[10px] pt-px mx-[8px] py-0 my-[4px]">
          {/* Chat Layout */}
          <div className="flex gap-6 h-[calc(100vh-140px)]">
            {/* Conversations Sidebar */}
            <div className="w-80 flex flex-col border border-border rounded-lg bg-card">
              {/* Header */}
              <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">CleanPro Chat</h2>
                <p className="text-sm text-muted-foreground">Comunicação com clientes</p>
              </div>

              {/* Search */}
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conversas..."
                    value={conversationSearch}
                    onChange={(e) => setConversationSearch(e.target.value)}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-3 pb-3 flex gap-2">
                <Button
                  variant={activeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                  className="text-xs"
                >
                  Todas
                </Button>
                <Button
                  variant={activeFilter === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("unread")}
                  className="text-xs"
                >
                  Não lidas
                </Button>
                <Button
                  variant={activeFilter === "favorites" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("favorites")}
                  className="text-xs"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Favoritas
                </Button>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">Nenhuma conversa ainda</p>
                    <Button variant="link" className="text-primary mt-2">
                      Iniciar nova conversa
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredConversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation === conv.id
                            ? "bg-primary/10"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedConversation(conv.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{conv.customer}</span>
                          <span className="text-xs text-muted-foreground">{conv.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conv.lastMessage}
                        </p>
                        {conv.unread && (
                          <Badge variant="default" className="mt-1 text-xs">
                            Nova
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col border border-border rounded-lg bg-card">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {selectedConversationData?.customer || "Selecione uma conversa"}
                </h3>
                
                {selectedConversationData && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border border-border">
                      <DropdownMenuItem 
                        onClick={handleDeleteConversation} 
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir conversa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Chat Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Selecione uma conversa
                </h3>
                <p className="text-muted-foreground mb-4">
                  Escolha uma conversa existente ou inicie uma nova
                </p>
                <Button variant="hero" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nova Mensagem</span>
                </Button>
              </div>

              {/* Message Input Area */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Smile className="w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2 bg-card border border-border" side="top" align="start">
                      <div className="grid grid-cols-8 gap-1">
                        {["😀", "😊", "😍", "🥰", "😎", "🤗", "😂", "🤣", "👍", "👏", "🙏", "💪", "❤️", "🔥", "⭐", "✨", "🎉", "🎊", "💯", "✅", "👋", "🤝", "💼", "🏠"].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            className="p-1 text-xl hover:bg-muted rounded cursor-pointer"
                            onClick={() => setMessageText((prev) => prev + emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="pr-16 bg-background"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {messageText.length}/160
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAttachFile}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="hero"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="rounded-full"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
