package dk.mudlogic;

import dk.mudlogic.browser.AppLoader;
import dk.mudlogic.jsinterfaces.*;

import dk.mudlogic.tools.log.LogFactory;
import dk.mudlogic.tools.log.LogTracer;

/** jDeskBox
 *
 * @author soren.pedersen
 *
 * jDeskBox is a Toolbox Integration for the desktop
 */
public class Main {

    public static AppLoader APP;
    public static LogFactory LOG_FACTORY = new LogFactory("jDeskBox");

    public static void main(String[] args) {

        //LogFactory logFactory = new LogFactory(LogFactory.class.getName(),"jDeskBox_res/save/");
        LogFactory logFactory = new LogFactory(LogFactory.class.getName());
        //logFactory.display(false);

        LogTracer log = logFactory.tracer(LogFactory.ERROR);

        Main.APP = new AppLoader();

        Main.APP.config().size(335,600);

        Main.APP.config().addJSI(new System_JSInterface("jSystem"));
        Main.APP.config().addJSI(new FirmafonAuth_JSInterface("FirmafonAuth"));
        Main.APP.config().addJSI(new Firmafon_JSInterface("Firmafon"));
        Main.APP.config().addJSI(new WebCache_JSInterface("jCache"));
        Main.APP.config().addJSI(new Console_JSInterface("console"));
        Main.APP.config().addJSI(new NotifierWindow_JSInterface("jNotify"));

        Main.APP.config().style_Utility();
        Main.APP.config().always_minimize(true);
        Main.APP.config().resizable(false);

       Main.APP.run("jDeskBox_res\\index.html");

        Main.LOG_FACTORY.close();
    }
}
