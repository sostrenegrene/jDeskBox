package dk.mudlogic.notifier;

import dk.mudlogic.Main;
import dk.mudlogic.tools.log.Logging;
import dk.mudlogic.tools.log.SimpleLogging;
import javafx.application.Platform;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Created by soren.pedersen on 15-04-2016.
 */
public class NotifyIconWindow {

    private Logging log = SimpleLogging.make_Logger(NotifyIconWindow.class);

    private IconsHandler icons;
    private MessageHandler messages;

    public NotifyIconWindow() {
        icons = new IconsHandler(new Dimension(30,30),new Dimension(50,50));
        icons.add_MouseHandler( new MouseHandler() );

        messages = new MessageHandler(new Dimension(300,50),new MouseHandler());
    }

    public void message(String message) {
        messages.message(message);
    }

    public IconsHandler icons() {
        return icons;
    }

    class MouseHandler extends MouseAdapter {
        private Dimension size = new Dimension(50,50);

        @Override
        public void mouseEntered(MouseEvent e) {
            //Reassign the icon scaled to window height x height
            icons().large();
        }

        @Override
        public void mouseExited(MouseEvent e) {
            //Reassign the icon scaled to window height x height
            icons().small();
        }

        @Override
        public void mouseClicked(MouseEvent e) {
            Platform.runLater(new Runnable() {
                @Override
                public void run() {
                    log.log("Icon clicked!");
                    icons().small();
                    Main.APP.config().maximize();
                    Main.APP.config().focus();
                }
            });
        }

    }//ENd MouseHandler

}
