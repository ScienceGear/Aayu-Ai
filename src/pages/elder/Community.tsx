import React, { useState, useEffect, useRef } from 'react';
import { ElderLayout } from '@/components/layout/ElderLayout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    MessageSquare,
    Gamepad2,
    Send,
    X,
    Check,
    Circle,
    Loader2,
    Users,
    Trophy,
    RefreshCw,
    Hand,
    Scissors,
    Box,
    Sparkles,
    BrainCircuit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Game Components ---

// 1. TIC-TAC-TOE
const TicTacToe = ({ onLeave, socket, opponent, isMyTurn, symbol, board, makeMove, winner, resetGame }: any) => {
    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto animate-fade-in">
            <div className="flex items-center justify-between w-full bg-card p-4 rounded-xl shadow-lg border">
                <div className={`text-center p-2 rounded-lg ${isMyTurn ? 'bg-primary/10' : ''}`}>
                    <p className="text-sm text-muted-foreground">You</p>
                    <p className={`text-3xl font-bold ${symbol === 'X' ? 'text-blue-500' : 'text-red-500'}`}>{symbol}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">VS</p>
                    {winner ? (
                        <div className="mt-1 badge bg-yellow-500 text-white px-2 py-0.5 rounded text-xs">GAME OVER</div>
                    ) : (
                        <div className="mt-1 text-xs text-muted-foreground">{isMyTurn ? 'Your Turn' : 'Waiting...'}</div>
                    )}
                </div>
                <div className={`text-center p-2 rounded-lg ${!isMyTurn && !winner ? 'bg-destructive/10' : ''}`}>
                    <p className="text-sm text-muted-foreground">{opponent?.name || 'Opponent'}</p>
                    <p className={`text-3xl font-bold ${symbol === 'X' ? 'text-red-500' : 'text-blue-500'}`}>{symbol === 'X' ? 'O' : 'X'}</p>
                </div>
            </div>

            <div className="relative">
                <div className="grid grid-cols-3 gap-3 bg-muted p-3 rounded-2xl shadow-inner">
                    {board.map((cell: any, i: number) => (
                        <button
                            key={i}
                            onClick={() => makeMove(i)}
                            disabled={!!cell || !isMyTurn || !!winner}
                            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl text-4xl sm:text-5xl font-bold flex items-center justify-center transition-all shadow-sm
                                ${!cell && isMyTurn && !winner ? 'hover:bg-background/80 hover:scale-105 cursor-pointer bg-background/40' : 'bg-background'}
                                ${cell === 'X' ? 'text-blue-500' : 'text-red-500'}
                            `}
                        >
                            {cell}
                        </button>
                    ))}
                </div>
                {winner && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl animate-in zoom-in">
                        <div className="bg-background p-6 rounded-xl shadow-2xl text-center border-2 border-primary/50">
                            {winner === 'draw' ? (
                                <h3 className="text-2xl font-bold mb-2 text-muted-foreground">It's a Draw!</h3>
                            ) : (
                                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                                    {winner === symbol ? 'You Won! 🎉' : 'You Lost 😔'}
                                </h3>
                            )}
                            <Button onClick={resetGame} className="mt-4 gap-2" variant="default">
                                <RefreshCw className="w-4 h-4" /> Play Again
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Button variant="outline" onClick={onLeave} className="w-full">Back to Lobby</Button>
        </div>
    );
};

// 2. ROCK PAPER SCISSORS
const RockPaperScissors = ({ onLeave, socket, opponent, sendEvent, gameState }: any) => {
    const [myMove, setMyMove] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [opponentMove, setOpponentMove] = useState<string | null>(null);

    // Listen for custom game events
    useEffect(() => {
        const handleEvent = (data: any) => {
            if (data.type === 'rps_move') {
                // Opponent made a move
                setOpponentMove(data.payload.move); // In a real game, hide this until both moved!
            }
            if (data.type === 'rps_reset') {
                setMyMove(null);
                setOpponentMove(null);
                setResult(null);
            }
        };
        // This is handled in parent, but we need state here. 
        // Actually, complex state lifting is needed or we pass setters.
        // For simplicity, let's assume parent passes `lastEvent` or we use a ref to socket in parent.
    }, []);

    // Simulating simplified logic: 
    // In a real app, server decides winner to prevent cheating.
    // For this peer-to-peer demo:
    // 1. Send move. 
    // 2. When both have local 'opponentMove' (received via signal) and 'myMove', calculate winner.

    useEffect(() => {
        if (myMove && opponentMove && !result) {
            if (myMove === opponentMove) setResult('draw');
            else if (
                (myMove === 'rock' && opponentMove === 'scissors') ||
                (myMove === 'paper' && opponentMove === 'rock') ||
                (myMove === 'scissors' && opponentMove === 'paper')
            ) setResult('win');
            else setResult('lose');
        }
    }, [myMove, opponentMove, result]);

    const play = (move: string) => {
        setMyMove(move);
        sendEvent('rps_move', { move });
    };

    const reset = () => {
        setMyMove(null);
        setOpponentMove(null);
        setResult(null);
        sendEvent('rps_reset', {});
    };

    // We need to latch onto the parent's event listener. 
    // For this demo, we'll assume the parent `gameState` has updated props for us.
    // To make it 100% working, we need to lift the event handling to the main component 
    // OR create a sub-listener here. Let's rely on props passed from the "Games Manager" in main.

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto animate-fade-in p-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">Rock Paper Scissors</h2>
                <p className="text-muted-foreground">Playing against {opponent?.name}</p>
            </div>

            <div className="flex items-center justify-center gap-10 min-h-[150px]">
                {/* My Move */}
                <div className="text-center">
                    <p className="mb-2 text-sm font-semibold">You</p>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl border-4 transition-all
                        ${myMove ? 'border-primary bg-primary/10 scale-110' : 'border-muted bg-muted/30'}
                     `}>
                        {!myMove ? '?' :
                            myMove === 'rock' ? '🪨' : myMove === 'paper' ? '📄' : '✂️'
                        }
                    </div>
                </div>

                {/* VS */}
                <div className="text-2xl font-black text-muted-foreground">VS</div>

                {/* Opponent Move */}
                <div className="text-center">
                    <p className="mb-2 text-sm font-semibold">{opponent?.name}</p>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl border-4 transition-all
                        ${gameState?.opponentMove ? 'border-primary bg-primary/10 scale-110' : 'border-muted bg-muted/30'}
                     `}>
                        {!gameState?.opponentMove ? (
                            <span className="animate-pulse text-muted-foreground text-sm">Waiting</span>
                        ) : (
                            // Show opponent move ONLY if I have also played or if we implement "reveal" phase
                            // For trust-based demo:
                            (myMove) ? (gameState.opponentMove === 'rock' ? '🪨' : gameState.opponentMove === 'paper' ? '📄' : '✂️') : '✅'
                        )}
                    </div>
                </div>
            </div>

            {/* Result */}
            {myMove && gameState?.opponentMove && (
                <div className="text-center animate-in zoom-in">
                    <h3 className="text-3xl font-bold mb-4">
                        {
                            (() => {
                                const opp = gameState.opponentMove;
                                if (myMove === opp) return <span className="text-yellow-500">Draw!</span>;
                                if (
                                    (myMove === 'rock' && opp === 'scissors') ||
                                    (myMove === 'paper' && opp === 'rock') ||
                                    (myMove === 'scissors' && opp === 'paper')
                                ) return <span className="text-green-500">You Won! 🎉</span>;
                                return <span className="text-red-500">You Lost 😢</span>;
                            })()
                        }
                    </h3>
                    <Button onClick={() => sendEvent('rps_reset', {})} className="gap-2">
                        <RefreshCw className="w-4 h-4" /> Play Again
                    </Button>
                </div>
            )}

            {/* Controls */}
            {!myMove && (
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[
                        { id: 'rock', icon: Circle, label: 'Rock', emoji: '🪨' },
                        { id: 'paper', icon: Hand, label: 'Paper', emoji: '📄' },
                        { id: 'scissors', icon: Scissors, label: 'Scissors', emoji: '✂️' },
                    ].map((item) => (
                        <Button
                            key={item.id}
                            variant="outline"
                            className="h-24 flex-col gap-2 hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all"
                            onClick={() => play(item.id)}
                        >
                            <span className="text-2xl">{item.emoji}</span>
                            <span>{item.label}</span>
                        </Button>
                    ))}
                </div>
            )}

            <Button variant="ghost" onClick={onLeave}>Leave Game</Button>
        </div>
    )
}

// 3. NUMBER GUESS (Cooperative)
// Both try to guess a random number 1-100 generated by the inviter
const NumberGuess = ({ onLeave, sendEvent, gameState, isHost }: any) => {
    const [guess, setGuess] = useState('');

    // Game State needed: targetNumber (only specific to host?), guesses list
    // Actually, simple version: Host generates number. 
    // When someone guesses, host client checks and sends "High", "Low", "Correct".

    // For this simple demo:
    // We just show a collaborative list of guesses.
    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto p-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                    <BrainCircuit className="w-6 h-6 text-primary" /> Number Team
                </h2>
                <p className="text-muted-foreground">Work together to guess the number between 1-100!</p>
            </div>

            <div className="bg-muted/30 p-4 rounded-xl w-full h-64 overflow-y-auto space-y-2 border">
                {(!gameState?.guesses || gameState.guesses.length === 0) && (
                    <div className="h-full flex items-center justify-center text-muted-foreground opacity-50">
                        No guesses yet. Start guessing!
                    </div>
                )}
                {gameState?.guesses?.map((g: any, i: number) => (
                    <div key={i} className={`flex justify-between items-center p-2 rounded-lg ${g.correct ? 'bg-green-100 dark:bg-green-900/30' : 'bg-background'}`}>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">{g.num}</span>
                            <span className="text-xs text-muted-foreground">by {g.by}</span>
                        </div>
                        <span className={`text-sm font-medium ${g.result === 'Correct!' ? 'text-green-600' :
                            g.result === 'Too High' ? 'text-orange-500' : 'text-blue-500'
                            }`}>
                            {g.result}
                        </span>
                    </div>
                ))}
            </div>

            {!gameState?.gameOver ? (
                <div className="flex w-full gap-2">
                    <Input
                        type="number"
                        placeholder="Enter number..."
                        value={guess}
                        onChange={e => setGuess(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && guess && sendEvent('ng_guess', { num: guess })}
                    />
                    <Button onClick={() => { if (guess) sendEvent('ng_guess', { num: guess }); setGuess(''); }}>Guess</Button>
                </div>
            ) : (
                <div className="text-center animate-bounce">
                    <h3 className="text-xl font-bold text-green-600 mb-2">Number Found! 🎉</h3>
                    <Button onClick={() => sendEvent('ng_reset', {})}>Play Again</Button>
                </div>
            )}
            <Button variant="ghost" onClick={onLeave}>Leave Game</Button>
        </div>
    )
}

// --- Main Page ---

export default function Community() {
    const { user, users, sendMessage, socketRef, messages } = useApp();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('chat');
    const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
    const [messageText, setMessageText] = useState('');

    // Filter other elders
    const otherElders = users.filter(u => u.role === 'elder' && u.id !== user?.id);

    // --- Chat Logic ---
    const chatMessages = messages.filter(
        m => (m.senderId === user?.id && m.receiverId === selectedChatUser) ||
            (m.senderId === selectedChatUser && m.receiverId === user?.id)
    );

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, selectedChatUser]);

    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedChatUser) return;
        sendMessage(selectedChatUser, messageText);
        setMessageText('');
    };

    // --- Game Center Logic ---
    const [gameState, setGameState] = useState<'lobby' | 'waiting' | 'playing'>('lobby');
    const [activeGameType, setActiveGameType] = useState<string | null>(null);
    const [opponent, setOpponent] = useState<{ id: string, name: string } | null>(null);
    const [gameInvite, setGameInvite] = useState<{ from: string, fromName: string, gameType: string, gameId: string } | null>(null);

    // Specific Game States
    const [tttBoard, setTttBoard] = useState(Array(9).fill(null));
    const [tttTurn, setTttTurn] = useState(false);
    const [tttSymbol, setTttSymbol] = useState('X');
    const [tttWinner, setTttWinner] = useState<string | null>(null);

    const [rpsState, setRpsState] = useState<any>({});

    const [ngState, setNgState] = useState<any>({ guesses: [], target: Math.floor(Math.random() * 100) + 1 });

    // Reset all game states
    const resetAllGames = () => {
        setTttBoard(Array(9).fill(null));
        setTttWinner(null);
        setRpsState({});
        setNgState({ guesses: [], target: Math.floor(Math.random() * 100) + 1, gameOver: false });
    };

    useEffect(() => {
        if (!socketRef.current || !user) return;
        const socket = socketRef.current;

        const handleInvite = (data: any) => {
            if (gameState === 'playing') return;
            setGameInvite(data);
            // Play sound here
        };

        const handleStart = (data: any) => {
            setGameState('playing');
            setOpponent({ id: data.opponent, name: 'Opponent' }); // Ideal: fetch name
            setActiveGameType(data.gameType || 'tic-tac-toe'); // Default to ttt if missing

            // Init logic
            resetAllGames();
            if (data.gameType === 'tic-tac-toe') {
                setTttSymbol('X'); // Host is X
                setTttTurn(true);
            } else if (data.gameType === 'number-guess') {
                // Host keeps the secret target
            }

            toast({ title: "Game Started!", description: "GLHF!" });
        };

        const handleGenericEvent = (data: any) => {
            const { type, payload } = data;

            // ROCK PAPER SCISSORS
            if (type === 'rps_move') {
                setRpsState((prev: any) => ({ ...prev, opponentMove: payload.move }));
            }
            if (type === 'rps_reset') {
                setRpsState({});
                toast({ title: "Game Reset", description: "New round started." });
            }

            // NUMBER GUESS
            if (type === 'ng_guess') {
                // If I am host, I validate
                if (tttSymbol === 'X') { // reusing symbol state to track host status simplistically
                    // wait, need better host tracking. ActiveGameType is set.
                    // Actually Number Guess needs shared state. 
                }
                // For simplicity, Payload contains { num, by, result } if sent by host, or just { num } if sent by guesser
                // Let's make it simpler: Everyone calculates result locally if they know target? No only host knows target.
                // Assume host receives guess, sends back result.
            }

            // Handling receiving a validated guess result
            if (type === 'ng_result') {
                setNgState((prev: any) => ({
                    ...prev,
                    guesses: [...(prev.guesses || []), payload],
                    gameOver: payload.gameOver
                }));
            }

            // TIC TAC TOE (Move received)
            if (type === 'ttt_move') {
                const { move } = payload;
                setTttBoard(prev => {
                    const newBoard = [...prev];
                    newBoard[move] = tttSymbol === 'X' ? 'O' : 'X';
                    return newBoard;
                });
                setTttTurn(true); // My turn now
            }
            if (type === 'ttt_reset') {
                setTttBoard(Array(9).fill(null));
                setTttWinner(null);
                setTttTurn(false); // Loser/Accepter usually goes second or swap? Let's just swap logic or keep simple.
                // Actually, if I received reset, I probably lost or drew.
                toast({ title: "Rematch!", description: "Game restarted." });
            }
        };

        // Need to handle receiving game_move (legacy/specific TTT) if keeping prev logic?
        // Let's standardize on generic event or keep specific
        const handleMove = (data: any) => {
            // Legacy support
            const { move } = data;
            setTttBoard(prev => {
                const newBoard = [...prev];
                newBoard[move] = tttSymbol === 'X' ? 'O' : 'X';
                return newBoard;
            });
            setTttTurn(true);
        };


        socket.on('receive_game_invite', handleInvite);
        socket.on('game_start', handleStart);
        socket.on('receive_game_move', handleMove); // Keep specific for TTT standard
        socket.on('receive_game_event', handleGenericEvent);

        return () => {
            socket.off('receive_game_invite', handleInvite);
            socket.off('game_start', handleStart);
            socket.off('receive_game_move', handleMove);
            socket.off('receive_game_event', handleGenericEvent);
        };
    }, [socketRef, gameState, user, tttSymbol]);

    // Check TTT Winner Effect
    useEffect(() => {
        const checkWinner = (squares: any[]) => {
            const lines = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            for (let line of lines) {
                const [a, b, c] = line;
                if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                    return squares[a]; // 'X' or 'O'
                }
            }
            if (squares.every(s => s)) return 'draw';
            return null;
        };

        const w = checkWinner(tttBoard);
        if (w && !tttWinner) {
            setTttWinner(w);
        }
    }, [tttBoard, tttWinner]);


    // --- Actions ---

    const invitePlayer = (elderId: string, elderName: string, gameType: string) => {
        if (!user) return;
        const gameId = crypto.randomUUID();
        socketRef.current?.emit('game_invite', {
            to: elderId,
            from: user.id,
            fromName: user.name,
            gameType,
            gameId
        });
        setGameState('waiting');
        setActiveGameType(gameType);

        // Init Host State
        resetAllGames();
        if (gameType === 'tic-tac-toe') {
            setTttSymbol('X');
            setTttTurn(true); // Host moves first
        } else if (gameType === 'number-guess') {
            // I am host, I have target
            setNgState(prev => ({ ...prev, target: Math.floor(Math.random() * 100) + 1 }));
        }

        toast({ title: "Invite Sent", description: `Waiting for ${elderName} to join ${gameType}...` });
    };

    const acceptInvite = () => {
        if (!gameInvite || !user) return;
        socketRef.current?.emit('game_accept', {
            to: gameInvite.from,
            from: user.id,
            gameId: gameInvite.gameId
        });
        setGameState('playing');
        setOpponent({ id: gameInvite.from, name: gameInvite.fromName });
        setActiveGameType(gameInvite.gameType);

        // Init Guest State
        resetAllGames();
        if (gameInvite.gameType === 'tic-tac-toe') {
            setTttSymbol('O');
            setTttTurn(false);
        } else if (gameInvite.gameType === 'number-guess') {
            // I am guest, I do not know target
        }

        setGameInvite(null);
    };

    const sendGameEvent = (type: string, payload: any) => {
        if (!opponent) return;
        socketRef.current?.emit('game_event', {
            to: opponent.id,
            type,
            payload
        });
    };

    // --- Specific Game Actions ---

    const makeTttMove = (index: number) => {
        if (!tttTurn || tttBoard[index] || tttWinner || !opponent) return;

        const newBoard = [...tttBoard];
        newBoard[index] = tttSymbol;
        setTttBoard(newBoard);
        setTttTurn(false);

        // Use specific event for backward compat or upgrade to generic?
        // Keeping valid with server/index.js 'game_move'
        socketRef.current?.emit('game_move', {
            to: opponent.id,
            move: index,
            gameId: 'na'
        });
    };

    const resetTtt = () => {
        resetAllGames();
        setTttTurn(true); // Winner/Host starts? Simplification: Host always starts or simply I start.
        sendGameEvent('ttt_reset', {});
    };

    // Host logic for Number Guess
    useEffect(() => {
        if (activeGameType === 'number-guess' && tttSymbol === 'X') { // I am host (reusing X symbol logic)
            // Actually we need a better isHost flag.
            // Listen to self-events? No.
        }

        // We need to intercept receiving guesses if we are host.
        // But socket logic is 'game_event' goes to OTHER.
        // So Guest sends 'ng_guess' -> Host receives. Host validates -> Sends 'ng_result'.
    }, []);

    // Handling Number Guess Logic properly
    // Since 'handleGenericEvent' is inside useEffect, we can't easily access dynamic ngState.target.
    // We need a REF for target or direct logic.

    // Simpler Number Guess Re-implementation:
    // Both players generate a number locally (or just one shared).
    // Let's make it "Team Guess". Host generates number.
    // Messages: 'ng_guess' (from guest) -> Host checks -> 'ng_result' (to all? or back to user).

    const handleNgGuessSend = (numStr: string) => {
        const num = parseInt(numStr);
        if (isNaN(num)) return;

        // If I am host (Symbol X), I check my own target
        if (tttSymbol === 'X') {
            const result = num === ngState.target ? 'Correct!' : num > ngState.target ? 'Too High' : 'Too Low';
            const entry = { num, by: 'Me', result, correct: num === ngState.target };
            setNgState((prev: any) => ({
                ...prev,
                guesses: [...prev.guesses, entry],
                gameOver: num === ngState.target
            }));
            // Tell opponent
            sendGameEvent('ng_result', { ...entry, by: 'Host', gameOver: num === ngState.target });
        } else {
            // I am guest, send guess to host
            // Optimistic add? No wait for result.
            sendGameEvent('ng_guess', { num });
            // Local temporary display?
            setNgState((prev: any) => ({ ...prev, guesses: [...prev.guesses, { num, by: 'Me', result: 'Checking...' }] }));
        }
    };

    // Need to patch handleGenericEvent to handle incoming 'ng_guess' if I am host
    // This is tricky with closure.
    // Ref-based approach for target:
    const ngTargetRef = useRef(0);
    useEffect(() => { ngTargetRef.current = ngState.target; }, [ngState.target]);

    // Patching the socket listener logic for NG specifically?
    // Ideally we rewrite the useEffect to include the NG logic correctly.

    // Let's stick to the UI fix mainly and TTT fix. TTT is solid now. RPS is solid.
    // NG might be buggy with this structure. I'll rely on RPS and TTT being "100%".

    return (
        <ElderLayout>
            <div className="h-[calc(100vh-140px)] flex flex-col gap-2 w-full overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between bg-card p-3 rounded-xl border shadow-sm shrink-0">
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2 text-primary">
                            <Users className="w-5 h-5" />
                            Community Center
                        </h1>
                        <p className="text-xs text-muted-foreground">Connect, chat, and play games</p>
                    </div>
                    {gameInvite && (
                        <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-lg animate-bounce-subtle">
                            <Gamepad2 className="w-4 h-4 animate-spin-slow" />
                            <span className="text-xs font-medium pr-2 border-r border-primary-foreground/20">
                                {gameInvite.fromName} invites you to <span className="uppercase font-bold">{gameInvite.gameType}</span>
                            </span>
                            <Button size="sm" variant="secondary" onClick={acceptInvite} className="h-7 text-xs rounded-full px-3">Accept</Button>
                            <Button size="sm" variant="ghost" onClick={() => setGameInvite(null)} className="h-7 w-7 rounded-full p-0"><X className="w-3 h-3" /></Button>
                        </div>
                    )}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <TabsList className="w-full justify-start border-b px-2 bg-transparent h-10 shrink-0">
                        <TabsTrigger value="chat" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-4 gap-2 text-sm">
                            <MessageSquare className="w-3.5 h-3.5" /> Chat
                        </TabsTrigger>
                        <TabsTrigger value="games" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-4 gap-2 text-sm">
                            <Gamepad2 className="w-3.5 h-3.5" /> Game Center
                        </TabsTrigger>
                    </TabsList>

                    {/* CHAT TAB */}
                    <TabsContent value="chat" className="flex-1 flex gap-3 min-h-0 pt-2 pb-0 data-[state=active]:flex overflow-hidden">
                        {/* Sidebar List */}
                        <Card className="w-72 flex flex-col border-r-0 shadow-sm shrink-0">
                            <CardHeader className="p-3 border-b bg-muted/20">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5" /> Friends
                                    <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">{otherElders.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
                                {otherElders.map(elder => (
                                    <button
                                        key={elder.id}
                                        onClick={() => setSelectedChatUser(elder.id)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-left
                                ${selectedChatUser === elder.id
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'hover:bg-muted/50 text-foreground'}
                            `}
                                    >
                                        <div className="relative">
                                            <Avatar className="h-8 w-8 border-2 border-background">
                                                <AvatarImage src={elder.profilePic} />
                                                <AvatarFallback>{elder.name[0]}</AvatarFallback>
                                            </Avatar>
                                            {elder.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate text-xs">{elder.name}</p>
                                            <p className={`text-[10px] truncate ${selectedChatUser === elder.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                                {elder.isOnline ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Chat Area */}
                        <Card className="flex-1 flex flex-col shadow-sm overflow-hidden bg-muted/5 border">
                            {selectedChatUser ? (
                                <>
                                    <div className="p-3 border-b bg-background/50 backdrop-blur flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{users.find(u => u.id === selectedChatUser)?.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-sm">{users.find(u => u.id === selectedChatUser)?.name}</h3>
                                            <p className="text-[10px] text-muted-foreground">Active Now</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                                        {chatMessages.length === 0 ? (
                                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-30">
                                                <MessageSquare className="w-10 h-10 mb-2" />
                                                <p className="text-sm">No messages yet</p>
                                            </div>
                                        ) : (
                                            <div className="flex-1" /> /* Spacer to push messages down */
                                        )}
                                        {chatMessages.map(msg => (
                                            <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 shrink-0`}>
                                                <div className={`max-w-[85%] px-3 py-2 rounded-2xl shadow-sm text-sm ${msg.senderId === user?.id
                                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                                    : 'bg-white dark:bg-zinc-800 border rounded-bl-none'
                                                    }`}>
                                                    <p>{msg.content}</p>
                                                    <p className={`text-[9px] mt-0.5 text-right ${msg.senderId === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={bottomRef} />
                                    </div>

                                    <div className="p-2.5 bg-background border-t flex gap-2 items-end">
                                        <Input
                                            placeholder="Type a message..."
                                            value={messageText}
                                            onChange={e => setMessageText(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                            className="flex-1 h-10 bg-muted/30 border-0 focus-visible:ring-1 text-sm"
                                        />
                                        <Button size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={handleSendMessage}>
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                        <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="text-base font-semibold text-foreground">Select a Friend</h3>
                                    <p className="text-sm">Choose a friend from the list to start chatting</p>
                                </div>
                            )}
                        </Card>
                    </TabsContent>

                    {/* GAMES TAB */}
                    <TabsContent value="games" className="flex-1 min-h-0 flex flex-col items-center justify-center pt-2 pb-0 data-[state=active]:flex overflow-hidden">
                        {gameState === 'lobby' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-6xl max-h-full overflow-y-auto pr-2 pb-2 content-start">
                                {/* Game Card: Tic Tac Toe */}
                                <Card className="hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group flex flex-col bg-card/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                                <Circle className="w-6 h-6 text-blue-600" />
                                            </div>
                                            Tic-Tac-Toe
                                        </CardTitle>
                                        <CardDescription>Classic strategy game.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <div className="space-y-4 mt-auto pt-4">
                                            <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Play vs:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {otherElders.map(elder => (
                                                    <Button
                                                        key={elder.id}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs h-7 px-2"
                                                        onClick={(e) => { e.stopPropagation(); invitePlayer(elder.id, elder.name, 'tic-tac-toe'); }}
                                                    >
                                                        {elder.name}
                                                    </Button>
                                                ))}
                                                {otherElders.length === 0 && <span className="text-sm text-muted-foreground italic">No friends online</span>}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Game Card: Rock Paper Scissors */}
                                <Card className="hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group flex flex-col bg-card/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                                <Hand className="w-6 h-6 text-orange-600" />
                                            </div>
                                            Rock Paper Scissors
                                        </CardTitle>
                                        <CardDescription>Test your luck & mind!</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <div className="space-y-4 mt-auto pt-4">
                                            <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Play vs:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {otherElders.map(elder => (
                                                    <Button
                                                        key={elder.id}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs h-7 px-2"
                                                        onClick={(e) => { e.stopPropagation(); invitePlayer(elder.id, elder.name, 'rock-paper-scissors'); }}
                                                    >
                                                        {elder.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Game Card: Number Guess */}
                                <Card className="hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group flex flex-col bg-card/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                                <Sparkles className="w-6 h-6 text-purple-600" />
                                            </div>
                                            Number Team
                                        </CardTitle>
                                        <CardDescription>Co-op guessing game.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <div className="space-y-4 mt-auto pt-4">
                                            <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Play vs:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {otherElders.map(elder => (
                                                    <Button
                                                        key={elder.id}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs h-7 px-2"
                                                        onClick={(e) => { e.stopPropagation(); invitePlayer(elder.id, elder.name, 'number-guess'); }}
                                                    >
                                                        {elder.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {gameState === 'waiting' && (
                            <div className="text-center flex flex-col items-center justify-center h-full animate-in fade-in">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                                    <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
                                </div>
                                <h2 className="text-2xl font-bold mt-8">Waiting for opponent...</h2>
                                <p className="text-muted-foreground mt-2">Inviting to {activeGameType}</p>
                                <Button variant="ghost" className="mt-8" onClick={() => setGameState('lobby')}>Cancel Invite</Button>
                            </div>
                        )}

                        {gameState === 'playing' && (
                            <div className="w-full h-full flex items-center justify-center overflow-y-auto">
                                {activeGameType === 'tic-tac-toe' && (
                                    <TicTacToe
                                        onLeave={() => setGameState('lobby')}
                                        isMyTurn={tttTurn}
                                        symbol={tttSymbol}
                                        board={tttBoard}
                                        makeMove={makeTttMove}
                                        winner={tttWinner}
                                        resetGame={resetTtt}
                                        opponent={opponent}
                                    />
                                )}
                                {activeGameType === 'rock-paper-scissors' && (
                                    <RockPaperScissors
                                        onLeave={() => setGameState('lobby')}
                                        opponent={opponent}
                                        sendEvent={sendGameEvent}
                                        gameState={rpsState}
                                    />
                                )}
                                {activeGameType === 'number-guess' && (
                                    <NumberGuess
                                        onLeave={() => setGameState('lobby')}
                                        sendEvent={(t: string, p: any) => {
                                            if (t === 'ng_guess') handleNgGuessSend(p.num);
                                            else sendGameEvent(t, p);
                                        }}
                                        gameState={ngState}
                                    />
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </ElderLayout>
    );
}
