package dk.mudlogic.notifier;

import javax.swing.*;
import java.awt.*;
import java.util.Hashtable;

/**
 * Created by soren.pedersen on 19-04-2016.
 */
public class IconsHandler {

    private Hashtable<String, ImageIcon> icons = new Hashtable<>();

    private NotifierWindowFrame window;
    private Dimension size_default, size_large;

    private String selected;
    private JLabel icon_label;

    public IconsHandler(Dimension size_default,Dimension size_large) {
        this.size_default = size_default;
        this.size_large = size_large;

        icon_label = new JLabel("",JLabel.CENTER);
    }

    public void add_icon(String name,String file) {
        ImageIcon image = new ImageIcon( file );
        icons.put(name,image);
    }

    public void add_MouseHandler(NotifyIconWindow.MouseHandler mh) {
        icon_label.addMouseListener(mh);
    }

    public void show(String icon) {
        window = new NotifierWindowFrame();
        window.add_Label(icon_label,BorderLayout.CENTER);
        window.make();

        small(icon);
    }

    public ImageIcon scale(ImageIcon ic,Dimension d) {
        ImageIcon i = ic;

        Image image = i.getImage();
        Image image2 = image.getScaledInstance(d.width,d.height, Image.SCALE_SMOOTH);
        i = new ImageIcon(image2);

        return i;
    }

    public void small(String icon) {
        ImageIcon i = scale( icons.get(icon),size_default);
        selected = icon;
        icon_label.setIcon(i);
        window.setWindowSize(size_default);
    }

    public void small() {
        ImageIcon i = scale( icons.get(selected),size_default);
        icon_label.setIcon(i);
        window.setWindowSize(size_default);
    }

    public void large(String icon) {
        ImageIcon i = scale( icons.get(icon),size_large);
        selected = icon;
        icon_label.setIcon(i);
        window.setWindowSize(size_large);

    }

    public void large() {
        ImageIcon i = scale( icons.get(selected),size_large);
        icon_label.setIcon(i);
        window.setWindowSize(size_large);
    }
}
