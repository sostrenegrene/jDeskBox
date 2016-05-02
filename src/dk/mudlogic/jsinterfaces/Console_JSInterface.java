package dk.mudlogic.jsinterfaces;

import dk.mudlogic.Main;
import dk.mudlogic.tools.interfaces.JSInterfaceExtender;
import dk.mudlogic.tools.log.LogFactory;
import dk.mudlogic.tools.log.LogTracer;
import dk.mudlogic.tools.log.Logging;
import dk.mudlogic.tools.log.SimpleLogging;

/**
 * Created by soren.pedersen on 14-04-2016.
 */
public class Console_JSInterface extends JSInterfaceExtender {

    private LogTracer logt = Main.LOG_FACTORY.tracer();

    public Console_JSInterface() {
        logt.setTracerTitle("Console_JSI");
    }

    public Console_JSInterface(String app_name) {
        this.setAppName(app_name);
    }

    public void log(String s) {
        logt.trace(s);
    }

}
