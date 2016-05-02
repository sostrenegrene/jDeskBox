package dk.mudlogic.notifier;

import javax.swing.*;
import java.awt.*;

/**
 * Created by soren.pedersen on 18-04-2016.
 */
public class NotifierWindowFrame extends JFrame {

    private Dimension screen_size;
    private Point position;

    public NotifierWindowFrame() {
        screen_size = Toolkit.getDefaultToolkit().getScreenSize();
    }

    private void setPosition() {
        position = new Point( (int) (screen_size.getWidth() - this.getSize().width), (int) (screen_size.getHeight() - 300) );

        this.setLocation( position.x, position.y );
    }

    public void add_Label(JLabel l,String orientation) {
        this.getContentPane().add(l,orientation);
    }

    public void make() {
        //2. Optional: What happens when the frame closes?
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setType(JFrame.Type.UTILITY);

        //Set look and feel
        this.setDefaultLookAndFeelDecorated(false);
        this.setUndecorated(true);
        this.setBackground( new Color(0,0,0,0) );

        //4. Size the frame.
        this.pack();

        this.setAlwaysOnTop(true);
        //5. Show it.
        this.setVisible(true);
    }

    public void setWindowSize(Dimension d) {
        this.setSize(d);
        setPosition();
    }

    public void visible(boolean b) {
        this.setVisible(b);
    }

    public Dimension getSize() {
        return this.getSize(new Dimension());
    }

}
