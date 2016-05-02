package dk.mudlogic.jsinterfaces;


import dk.mudlogic.Main;
import dk.mudlogic.browser.GlobalBrowserStore;
import dk.mudlogic.tools.interfaces.JSInterfaceExtender;
import dk.mudlogic.tools.log.LogTracer;
import dk.mudlogic.tools.log.Logging;
import dk.mudlogic.tools.log.SimpleLogging;

import java.io.File;
import java.io.IOException;

/**
 * Created by soren.pedersen on 07-04-2016.
 */
public class System_JSInterface extends JSInterfaceExtender {

    private LogTracer logt = Main.LOG_FACTORY.tracer();

    public System_JSInterface() {
        logt.setTracerTitle("System_JSI");
    }

    public System_JSInterface(String app_name) {
        this.setAppName(app_name);
    }

    public void log(String s) {
        logt.trace(s);
    }

    public void load(String file) {
        String f = new File("jDeskBox_res/"+file).getAbsolutePath();
        Main.APP.browser().engine().load("file:///"+f);
    }

    public void exit_application() {
        Main.LOG_FACTORY.close();
        System.exit(0);
    }

    public void script(String js) {
        this.getEngine().executeScript(js);
    }

    public void exec(String cmd) {

        try {
            Runtime.getRuntime().exec( cmd );
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public void setWindowTitle(String title) {
        Main.APP.config().update_title(title);
    }

}
