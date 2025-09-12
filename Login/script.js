// Переконайтесь, що код запускається лише після повного завантаження DOM
document.addEventListener('DOMContentLoaded', function() {

    // Перевіряємо, чи існує на сторінці секція .login-section, щоб ініціалізувати логіку входу
    if (document.querySelector('.login-section')) {
        initLoginPage();
    }
});

/**
 * Ініціалізує логіку для сторінки входу.
 * Встановлює слухачі подій для соціальних кнопок та форми входу.
 */
function initLoginPage() {
    // Отримуємо всі кнопки соціального входу
    const socialButtons = document.querySelectorAll('.social-login-btn');
    socialButtons.forEach(button => {
        // Додаємо слухач кліків до кожної кнопки
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Запобігаємо стандартній поведінці кнопки
            const provider = this.classList.contains('facebook-btn') ? 'Facebook' : 'Google';
            showMessage(`Перенаправлення на сторінку входу ${provider}...`, 'info');
        });
    });

    // Отримуємо форму входу
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        // Додаємо слухач події "submit" для форми
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Запобігаємо стандартному відправленню форми

            // Отримуємо значення полів електронної пошти та пароля
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Валідація полів: перевіряємо, чи вони не порожні
            if (!email || !password) {
                showMessage('Будь ласка, заповніть усі поля', 'error');
                return;
            }

            // Виводимо повідомлення про спробу входу
            showMessage(`Вхід з електронною поштою: ${email}`, 'success');
        });
    }

    /**
     * Відображає повідомлення користувачу.
     * @param {string} message - Текст повідомлення.
     * @param {string} type - Тип повідомлення ('info', 'success', 'error').
     */
    function showMessage(message, type) {
        let messageBox = document.querySelector('.message-box');
        // Якщо контейнер для повідомлень не існує, створюємо його
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.classList.add('message-box');
            document.body.appendChild(messageBox);
        }

        // Створюємо елемент для повідомлення
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.classList.add('message');
        messageEl.classList.add(type);

        // Додаємо повідомлення до контейнера
        messageBox.appendChild(messageEl);

        // Видаляємо повідомлення через 3 секунди
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    // Додаємо базові стилі для messageBox, якщо їх немає в CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .message-box {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .message {
            padding: 15px;
            border-radius: 8px;
            color: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-size: 16px;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .message.info {
            background-color: #007bff;
        }
        .message.success {
            background-color: #28a745;
        }
        .message.error {
            background-color: #dc3545;
        }
        .message.show {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Додаємо клас .show для анімації появи
    setTimeout(() => {
        document.querySelectorAll('.message').forEach(el => el.classList.add('show'));
    }, 10);
}
