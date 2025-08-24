import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.Serial; // Додано для сумісності

public class TestGame extends JPanel implements ActionListener, KeyListener {
    @Serial
    private static final long serialVersionUID = 1L; // Додано для серіалізації

    // Розміри вікна
    private static final int WIDTH = 600;
    private static final int HEIGHT = 400;

    // Параметри ракеток і м'яча
    private static final int PADDLE_WIDTH = 10;
    private static final int PADDLE_HEIGHT = 80;
    private static final int BALL_SIZE = 20;

    // Положення ракеток
    private int player1Y = HEIGHT / 2 - PADDLE_HEIGHT / 2;
    private int player2Y = HEIGHT / 2 - PADDLE_HEIGHT / 2;

    // Швидкість ракеток - для гравця
    private int player1Speed = 0;

    // Положення м'яча
    private int ballX = WIDTH / 2 - BALL_SIZE / 2;
    private int ballY = HEIGHT / 2 - BALL_SIZE / 2;
    private int ballXSpeed = 8;
    private int ballYSpeed = 8;

    // Очки
    private int scorePlayer1 = 0;
    private int scorePlayer2 = 0;

    // Ліміт очок для завершення гри
    private static final int SCORE_LIMIT = 1000000;

    private final Timer timer;

    public TestGame() {
        setPreferredSize(new Dimension(WIDTH, HEIGHT));
        setBackground(Color.BLACK);
        setFocusable(true);
        addKeyListener(this);
        timer = new Timer(15, this);
        timer.start();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        // Малюємо ракетки
        g.setColor(Color.WHITE);
        g.fillRect(50, player1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
        g.fillRect(WIDTH - 50 - PADDLE_WIDTH, player2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

        // Малюємо м'яч
        g.fillOval(ballX, ballY, BALL_SIZE, BALL_SIZE);

        // Відображаємо очки
        g.setFont(new Font("Arial", Font.BOLD, 16));
        g.drawString("Player: " + scorePlayer1, 20, 20);
        g.drawString("Mr robot: " + scorePlayer2, WIDTH - 120, 20);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        // Оновлюємо позицію ракеток гравця
        player1Y += player1Speed;

        // Обмеження руху ракеток в межах екрану
        if (player1Y < 0) player1Y = 0;
        if (player1Y > HEIGHT - PADDLE_HEIGHT) player1Y = HEIGHT - PADDLE_HEIGHT;

        // Простий AI для другої ракетки
        int aiSpeed = 4; // швидкість AI
        int aiCenter = player2Y + PADDLE_HEIGHT / 2;
        int ballCenter = ballY + BALL_SIZE / 2;
        if (aiCenter < ballCenter - 10) {
            player2Y += aiSpeed;
        } else if (aiCenter > ballCenter + 10) {
            player2Y -= aiSpeed;
        }
        // Обмежуємо AI в межах екрану
        if (player2Y < 0) player2Y = 0;
        if (player2Y > HEIGHT - PADDLE_HEIGHT) player2Y = HEIGHT - PADDLE_HEIGHT;

        // Оновлюємо позицію м'яча
        ballX += ballXSpeed;
        ballY += ballYSpeed;

        // Колізія з верхньою і нижньою стінками
        if (ballY <= 0 || ballY >= HEIGHT - BALL_SIZE) {
            ballYSpeed = -ballYSpeed;
        }

        // Колізія з ракетками
        // Ліва ракетка (гравець)
        if (ballX <= 50 + PADDLE_WIDTH &&
            ballY + BALL_SIZE >= player1Y &&
            ballY <= player1Y + PADDLE_HEIGHT) {
            ballXSpeed = -ballXSpeed;
            ballX = 50 + PADDLE_WIDTH; // щоб не злипало
        }
        // Права ракетка (комп’ютер)
        if (ballX + BALL_SIZE >= WIDTH - 50 - PADDLE_WIDTH &&
            ballY + BALL_SIZE >= player2Y &&
            ballY <= player2Y + PADDLE_HEIGHT) {
            ballXSpeed = -ballXSpeed;
            ballX = WIDTH - 50 - PADDLE_WIDTH - BALL_SIZE; // щоб не злипало
        }

        // Вихід за межі екрана - підрахунок очок і скидання м'яча
        if (ballX < 0) {
            scorePlayer2++;
            resetBall();
        } else if (ballX > WIDTH - BALL_SIZE) {
            scorePlayer1++;
            resetBall();
        }

        // Перевіряємо, чи досягнуто ліміту очок
        if (scorePlayer1 >= SCORE_LIMIT || scorePlayer2 >= SCORE_LIMIT) {
            endGame();
        }

        repaint();
    }

    private void resetBall() {
        ballX = WIDTH / 2 - BALL_SIZE / 2;
        ballY = HEIGHT / 2 - BALL_SIZE / 2;
        ballXSpeed = 6 * (Math.random() > 0.5 ? 1 : -1);
        ballYSpeed = 6 * (Math.random() > 0.5 ? 1 : -1);
    }

    // Метод для завершення гри та відображення вікна
    private void endGame() {
        // Зупиняємо ігровий таймер, щоб гра замерла
        timer.stop();

        // Створюємо нове вікно
        JFrame gameOverFrame = new JFrame("Game Over");
        gameOverFrame.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
        gameOverFrame.setUndecorated(true);

        // Створюємо напис "GAME OVER"
        JLabel gameOverLabel = new JLabel("GAME OVER", SwingConstants.CENTER);
        // Встановлюємо той самий шрифт, що і для очок
        gameOverLabel.setFont(new Font("Arial", Font.BOLD, 16));
        gameOverLabel.setForeground(Color.WHITE); // Білий колір тексту для контрасту
        
        // Створюємо панель для напису
        JPanel panel = new JPanel(new BorderLayout());
        panel.add(gameOverLabel, BorderLayout.CENTER);
        panel.setBackground(Color.BLACK); // Чорний фон, як і в грі
        gameOverFrame.add(panel);

        gameOverFrame.pack();
        // Встановлюємо розмір вікна "GAME OVER" та розміщуємо його по центру
        gameOverFrame.setSize(WIDTH, HEIGHT);
        gameOverFrame.setLocationRelativeTo(null);
        gameOverFrame.setVisible(true);

	/*----------------------------- ТУТ Я НЕ ЗАКІНЧИВ ---------------- */

        // Створюємо таймер, який закриє обидва вікна через 3 секунди
        Timer closeTimer = new Timer(3000, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                gameOverFrame.dispose(); // Закриваємо вікно "GAME OVER"
                // Отримуємо основне вікно гри та закриваємо його
                Window window = SwingUtilities.getWindowAncestor(TestGame.this);
                if (window instanceof JFrame) {
                    ((JFrame) window).dispose();
                }
            }
        });
        closeTimer.setRepeats(false); // Запускаємо лише один раз
        closeTimer.start();
    }

    @Override
    public void keyPressed(KeyEvent e) {
        int key = e.getKeyCode();

        // Управління для гравця 1 (W і S)
        if (key == KeyEvent.VK_W) {
            player1Speed = -15;
        } else if (key == KeyEvent.VK_S) {
            player1Speed = 15;
        }

        // Обробка клавіші ESC для виходу
        if (key == KeyEvent.VK_ESCAPE) {
            int response = JOptionPane.showConfirmDialog(this, "Exit game?", "Exit", JOptionPane.YES_NO_OPTION);
            if (response == JOptionPane.YES_OPTION) {
                System.exit(0);
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        int key = e.getKeyCode();
        if (key == KeyEvent.VK_W || key == KeyEvent.VK_S) {
            player1Speed = 0;
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
        // Не використовується
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Hard-pong");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(new TestGame());
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }
}

