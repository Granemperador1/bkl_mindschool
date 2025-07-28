<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class WelcomeNotification extends Notification
{
    use Queueable;

    protected $nombre;

    public function __construct($nombre)
    {
        $this->nombre = $nombre;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('¡Bienvenido/a a MindSchool!')
            ->greeting('¡Bienvenido/a a MindSchool, ' . $this->nombre . '!')
            ->line('Qué alegría inmensa tenerte con nosotros. Hoy no solo te unes a una plataforma, sino que te sumas a una comunidad vibrante de mentes curiosas y apasionadas, listas para explorar, aprender y crecer sin límites.')
            ->line('En MindSchool, creemos firmemente en el potencial extraordinario que cada persona lleva dentro, y estamos aquí para ser el impulso que necesitas para desbloquearlo. Hemos preparado cada curso, cada recurso y cada interacción pensando en ti, para que tu camino de aprendizaje sea no solo efectivo, sino también inspirador, divertido y verdaderamente transformador.')
            ->line('Considera este tu nuevo hogar para el conocimiento. Aquí, cada paso que das te acerca más a tus sueños y cada desafío es una oportunidad para brillar. Estamos emocionados por acompañarte en esta aventura y ver todo lo que vas a lograr.')
            ->line('Así que, respira hondo, sonríe y prepárate para una experiencia única. Tu viaje hacia un futuro más brillante comienza hoy. ¡Estamos aquí para ti en cada paso del camino!')
            ->salutation('Con todo el entusiasmo,\n\nEl equipo de MindSchool');
    }
} 