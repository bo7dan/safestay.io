import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.Serial;

public class HardPong extends JPanel implements ActionListener, KeyListener {
    @Serial
    private static final long serialVersionUID = 1L;

    // Window dimensions
    private static final int WIDTH = 1000;
    private static final int HEIGHT = 800;

    // Paddle and ball parameters, scaled for the new size
    private static final int PADDLE_WIDTH = 15;
    private static final int PADDLE_HEIGHT = 120;
    private static final int BALL_SIZE = 25;

    // Paddle positions
    private int player1Y = HEIGHT / 2 - PADDLE_HEIGHT / 2;
    private int player2Y = HEIGHT / 2 - PADDLE_HEIGHT / 2;

    // Paddle speed for player 1
    private int player1Speed = 0;

    // Ball position and speed
    private int ballX = WIDTH / 2 - BALL_SIZE / 2;
    private int ballY = HEIGHT / 2 - BALL_SIZE / 2;
    private int ballXSpeed = 10;
    private int ballYSpeed = 10;

    // Scores
    private int scorePlayer1 = 0;
    private int scorePlayer2 = 0;

    // Score limit for game over
    private static final int SCORE_LIMIT = 1000000;

    private final Timer timer;

    public HardPong() {
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

        // Draw paddles
        g.setColor(Color.WHITE);
        g.fillRect(70, player1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
        g.fillRect(WIDTH - 70 - PADDLE_WIDTH, player2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

        // Draw ball
        g.fillOval(ballX, ballY, BALL_SIZE, BALL_SIZE);

        // Display scores
        g.setFont(new Font("Arial", Font.BOLD, 24));
        g.drawString("Player: " + scorePlayer1, 50, 40);
        g.drawString("Mr robot: " + scorePlayer2, WIDTH - 200, 40);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        // Update player 1's paddle position
        player1Y += player1Speed;

        // Keep paddles within the screen bounds
        if (player1Y < 0) player1Y = 0;
        if (player1Y > HEIGHT - PADDLE_HEIGHT) player1Y = HEIGHT - PADDLE_HEIGHT;

        // Simple AI for the second paddle
        int aiSpeed = 6;
        int aiCenter = player2Y + PADDLE_HEIGHT / 2;
        int ballCenter = ballY + BALL_SIZE / 2;
        if (aiCenter < ballCenter - 10) {
            player2Y += aiSpeed;
        } else if (aiCenter > ballCenter + 10) {
            player2Y -= aiSpeed;
        }
        // Keep AI paddle within the screen bounds
        if (player2Y < 0) player2Y = 0;
        if (player2Y > HEIGHT - PADDLE_HEIGHT) player2Y = HEIGHT - PADDLE_HEIGHT;

        // Update ball's position
        ballX += ballXSpeed;
        ballY += ballYSpeed;

        // Collision with top and bottom walls
        if (ballY <= 0 || ballY >= HEIGHT - BALL_SIZE) {
            ballYSpeed = -ballYSpeed;
        }

        // Collision with paddles
        // Left paddle (player)
        if (ballX <= 70 + PADDLE_WIDTH &&
            ballY + BALL_SIZE >= player1Y &&
            ballY <= player1Y + PADDLE_HEIGHT) {
            ballXSpeed = -ballXSpeed;
            ballX = 70 + PADDLE_WIDTH;
        }
        // Right paddle (computer)
        if (ballX + BALL_SIZE >= WIDTH - 70 - PADDLE_WIDTH &&
            ballY + BALL_SIZE >= player2Y &&
            ballY <= player2Y + PADDLE_HEIGHT) {
            ballXSpeed = -ballXSpeed;
            ballX = WIDTH - 70 - PADDLE_WIDTH - BALL_SIZE;
        }

        // Out of bounds - score and reset ball
        if (ballX < 0) {
            scorePlayer2++;
            resetBall();
        } else if (ballX > WIDTH - BALL_SIZE) {
            scorePlayer1++;
            resetBall();
        }

        // Check if score limit is reached
        if (scorePlayer1 >= SCORE_LIMIT || scorePlayer2 >= SCORE_LIMIT) {
            endGame();
        }

        repaint();
    }

    private void resetBall() {
        ballX = WIDTH / 2 - BALL_SIZE / 2;
        ballY = HEIGHT / 2 - BALL_SIZE / 2;
        ballXSpeed = 10 * (Math.random() > 0.5 ? 1 : -1);
        ballYSpeed = 10 * (Math.random() > 0.5 ? 1 : -1);
    }

    private void endGame() {
        timer.stop();

        JFrame gameOverFrame = new JFrame("Game Over");
        gameOverFrame.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
        gameOverFrame.setUndecorated(true);

        JLabel gameOverLabel = new JLabel("GAME OVER", SwingConstants.CENTER);
        gameOverLabel.setFont(new Font("Arial", Font.BOLD, 24));
        gameOverLabel.setForeground(Color.WHITE); 
        
        JPanel panel = new JPanel(new BorderLayout());
        panel.add(gameOverLabel, BorderLayout.CENTER);
        panel.setBackground(Color.BLACK); 
        gameOverFrame.add(panel);

        gameOverFrame.pack();
        gameOverFrame.setSize(WIDTH, HEIGHT);
        gameOverFrame.setLocationRelativeTo(null);
        gameOverFrame.setVisible(true);

        Timer closeTimer = new Timer(3000, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                gameOverFrame.dispose();
                Window window = SwingUtilities.getWindowAncestor(HardPong.this);
                if (window instanceof JFrame) {
                    ((JFrame) window).dispose();
                }
            }
        });
        closeTimer.setRepeats(false);
        closeTimer.start();
    }

    @Override
    public void keyPressed(KeyEvent e) {
        int key = e.getKeyCode();

        if (key == KeyEvent.VK_W) {
            player1Speed = -20;
        } else if (key == KeyEvent.VK_S) {
            player1Speed = 20;
        }

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
        // Not used
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Hard-pong");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(new HardPong());
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }
}
