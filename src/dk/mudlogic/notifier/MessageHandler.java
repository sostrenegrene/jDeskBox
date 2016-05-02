package dk.mudlogic.notifier;

import javax.swing.*;
import java.awt.*;

/**
 * Created by soren.pedersen on 20-04-2016.
 */
public class MessageHandler {

    private NotifierWindowFrame window;
    private JLabel message_label;

    public MessageHandler(Dimension size, NotifyIconWindow.MouseHandler mouse) {
        window = new NotifierWindowFrame();

        message_label = new JLabel("",JLabel.CENTER);
        message_label.setVisible(true);
        message_label.setOpaque(true);
        message_label.setBackground(Color.darkGray);
        message_label.setForeground(Color.white);
        message_label.addMouseListener(mouse);

        window.add_Label(message_label,BorderLayout.CENTER);

        window.make();
        window.setVisible(false);
        window.setWindowSize(size);
    }

    public void message(String message) {
        message_label.setText(message);
        window.visible(true);

        new MessageTimer().timer(5);
    }


    class MessageTimer {

        public void timer(int timeout) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    int time = 0;

                    try {
                        while(time <= timeout) {
                            Thread.sleep(1000);
                            time++;
                        }

                        message_label.setText("");
                        window.visible(false);
                    }
                    catch(Exception e) {
                        e.printStackTrace();
                        message_label.setText("");
                        window.visible(false);
                    }
                }
            }).start();
        }

    }
}
