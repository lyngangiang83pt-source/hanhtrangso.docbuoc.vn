import React, { useState, useEffect } from 'react';
import { getGames } from '../../config/supabase';
import { Gamepad2, Trophy, RotateCcw, CheckCircle, XCircle, Award, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function GamesView() {
  const [gamesList, setGamesList] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Trạng thái Flashcards
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const data = await getGames();
    setGamesList(data);
  };

  const handleStartGame = (game) => {
    setSelectedGame(game);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setFlashcardIndex(0);
    setIsFlipped(false);
  };

  const handleAnswerClick = (optionIdx, correctIdx) => {
    if (selectedOption !== null) return; // Không cho bấm 2 lần
    setSelectedOption(optionIdx);

    if (optionIdx === correctIdx) {
      setScore(prev => prev + 10);
    }
  };

  const handleNextQuestion = () => {
    const questions = selectedGame?.game_data?.questions || [];
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HEADER GAME HỌC TẬP */}
      <div className="flex items-center justify-between glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>Mục 2.2 - Game Học Tập Tương Tác</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Tổng Hợp Game Học Tập Sáng Tạo
          </h2>
        </div>

        {selectedGame && (
          <button
            onClick={() => setSelectedGame(null)}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đổi Game Khác</span>
          </button>
        )}
      </div>

      {/* DANH SÁCH GAME KHI CHƯA CHỌN */}
      {!selectedGame ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gamesList.map((game) => (
            <div 
              key={game.id}
              className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/50 flex flex-col justify-between space-y-4 group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">
                    {game.game_type === 'quiz' ? 'Trắc Nghiệm Đấu Trí' : 'Thẻ Bài Flashcards'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Môn: {game.subject}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {game.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <button
                onClick={() => handleStartGame(game)}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all group-hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bắt Đầu Chơi Ngay</span>
              </button>
            </div>
          ))}
        </div>
      ) : selectedGame.game_type === 'quiz' ? (
        
        /* GIAO DIỆN CHƠI GAME QUIZ TRẮC NGHIỆM */
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          
          {!isFinished ? (
            <>
              {/* Thanh Tiến Trình & Điểm Số */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-slate-400">
                  Câu hỏi {currentQuestionIndex + 1} / {selectedGame.game_data?.questions?.length}
                </span>
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/30">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Điểm: {score}</span>
                </div>
              </div>

              {/* Câu hỏi */}
              {(() => {
                const q = selectedGame.game_data.questions[currentQuestionIndex];
                return (
                  <div className="space-y-6">
                    <h3 className="font-display font-bold text-lg text-white leading-relaxed">
                      {q.question}
                    </h3>

                    {/* Các phương án trả lời */}
                    <div className="grid grid-cols-1 gap-3">
                      {q.options.map((opt, idx) => {
                        let btnStyle = "bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500/50";
                        if (selectedOption !== null) {
                          if (idx === q.answer) {
                            btnStyle = "bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold";
                          } else if (idx === selectedOption) {
                            btnStyle = "bg-rose-600/20 border-rose-500 text-rose-300 font-bold";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswerClick(idx, q.answer)}
                            disabled={selectedOption !== null}
                            className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                            {selectedOption !== null && idx === q.answer && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                            {selectedOption === idx && idx !== q.answer && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Lời giải thích khi đã chọn */}
                    {selectedOption !== null && (
                      <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200 animate-in fade-in">
                        <strong>Giải thích:</strong> {q.explanation}
                      </div>
                    )}

                    {/* Nút Câu Kế Tiếp */}
                    {selectedOption !== null && (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all flex items-center justify-center space-x-2"
                      >
                        <span>{currentQuestionIndex + 1 === selectedGame.game_data.questions.length ? 'Hoàn Thành' : 'Câu Tiếp Theo'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })()}
            </>
          ) : (
            /* KẾT QUẢ GAME QUIZ */
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-xl shadow-amber-500/30">
                <Award className="w-10 h-10 text-slate-950" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-white">Xuất Sắc! Bạn Đã Hoàn Thành</h3>
                <p className="text-sm text-slate-400">Tổng điểm thưởng đạt được của bạn:</p>
                <div className="text-4xl font-extrabold text-amber-400">{score} ĐIỂM</div>
              </div>

              <button
                onClick={() => handleStartGame(selectedGame)}
                className="px-6 py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
              >
                Chơi Lại Game Này
              </button>
            </div>
          )}

        </div>
      ) : (
        
        /* GIAO DIỆN GAME FLASHCARDS THẺ BÀI */
        <div className="max-w-md mx-auto space-y-6 text-center">
          {(() => {
            const cards = selectedGame.game_data.cards || [];
            const card = cards[flashcardIndex];
            return (
              <div className="space-y-6">
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full h-64 glass-panel rounded-3xl border border-indigo-500/40 p-8 flex items-center justify-center cursor-pointer shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block">
                      {isFlipped ? 'Mặt Sau - Đáp Án / Giải Thích' : 'Mặt Trước - Khái Niệm'}
                    </span>
                    <p className="font-display font-bold text-xl text-white leading-relaxed">
                      {isFlipped ? card?.back : card?.front}
                    </p>
                    <span className="text-[10px] text-slate-500 block italic">
                      (Bấm vào thẻ để lật mặt)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4">
                  <button
                    disabled={flashcardIndex === 0}
                    onClick={() => { setFlashcardIndex(prev => prev - 1); setIsFlipped(false); }}
                    className="px-4 py-2 rounded-xl text-xs bg-slate-800 disabled:opacity-50 text-slate-300"
                  >
                    Thẻ Trước
                  </button>

                  <span className="text-xs text-slate-400 font-semibold">
                    {flashcardIndex + 1} / {cards.length}
                  </span>

                  <button
                    disabled={flashcardIndex + 1 === cards.length}
                    onClick={() => { setFlashcardIndex(prev => prev + 1); setIsFlipped(false); }}
                    className="px-4 py-2 rounded-xl text-xs bg-indigo-600 disabled:opacity-50 text-white font-bold"
                  >
                    Thẻ Tiếp Theo
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
}
