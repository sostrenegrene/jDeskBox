package dk.mudlogic.jsinterfaces;

import dk.mudlogic.notifier.NotifyIconWindow;
import dk.mudlogic.tools.interfaces.JSInterfaceExtender;
import dk.mudlogic.tools.log.Logging;
import dk.mudlogic.tools.log.SimpleLogging;

/**
 * Created by soren.pedersen on 17-04-2016.
 */
public class NotifierWindow_JSInterface extends JSInterfaceExtender {

    private NotifyIconWindow nw;
    private Logging log = SimpleLogging.make_Logger(NotifierWindow_JSInterface.class);

    public NotifierWindow_JSInterface() {
        setup_Window();
    }

    public NotifierWindow_JSInterface(String app_name) {
        this.setAppName(app_name);

        setup_Window();
    }

    private void setup_Window() {

        nw = new NotifyIconWindow();
        nw.icons().add_icon("available","jDeskBox_res/plugins/firmafon/images/phone-available50x50.png");
        nw.icons().add_icon("busy","jDeskBox_res/plugins/firmafon/images/phone-busy50x50.png");
        nw.icons().add_icon("ringing","jDeskBox_res/plugins/firmafon/images/phone-do_not_disturb50x50.png");
        nw.icons().add_icon("do_not_disturb","jDeskBox_res/plugins/firmafon/images/phone-do_not_disturb50x50.png");
        nw.icons().add_icon("unknown","jDeskBox_res/plugins/firmafon/images/phone-unknown50x50.png");
        nw.icons().add_icon("inactive","jDeskBox_res/plugins/firmafon/images/phone-inactive50x50.png");

        nw.icons().show("available");
    }

    public void icon(String presence) {
        nw.icons().small(presence);
    }

    public void icon_large(String presence) {
        nw.icons().large(presence);
    }

    public void message(String message) {
        nw.message(message);
    }

}
