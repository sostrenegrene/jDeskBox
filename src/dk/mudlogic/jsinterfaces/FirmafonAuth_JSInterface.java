package dk.mudlogic.jsinterfaces;

import dk.mudlogic.Main;
import dk.mudlogic.browser.GlobalBrowserStore;
import dk.mudlogic.tools.files.File_Reader;
import dk.mudlogic.tools.files.File_Writer;
import dk.mudlogic.tools.interfaces.JSInterfaceExtender;
import dk.mudlogic.tools.log.LogFactory;
import dk.mudlogic.tools.log.LogTracer;
import dk.mudlogic.tools.log.Logging;
import dk.mudlogic.tools.log.SimpleLogging;

/**
 * Created by soren.pedersen on 12-04-2016.
 */
public class FirmafonAuth_JSInterface extends JSInterfaceExtender {

    private LogTracer logt = Main.LOG_FACTORY.tracer();

    private String token = "";

    public FirmafonAuth_JSInterface() {
        logt.setTracerTitle("Firmafon_Auth_JSI");
        loadToken();
    }

    public FirmafonAuth_JSInterface(String app_name) {
        logt.setTracerTitle("Firmafon_Auth_JSI");
        this.setAppName(app_name);
        loadToken();
    }

    private void loadToken() {
        try {
            logt.trace("Loading token file");
            File_Reader fr = new File_Reader("jDeskBox_res/save/token.txt");
            String s = fr.readfile();
            this.token = s;
        }
        catch(Exception e) {
            this.token = "";

            logt.error("Token file not found");
        }
    }

    public void reset_auth() {
        File_Writer f = new File_Writer("jDeskBox_res/save/token.txt");
        f.delete();

        this.token = "";
        resize_ToLogin();
        this.getEngine().executeScript("jSystem.load(\"firmafon_auth.html\");");
    }

    public boolean has_auth() {
        if (token.equals("")) { return false; }
        else { return true; }
    }

    public void auth(String token) {
        logt.trace("Access_Token: " + token);
        this.token = token;

        File_Writer fw = new File_Writer("jDeskBox_res/save/token.txt");
        fw.write(token);
        fw.close();
    }

    public String token() {
        return token;
    }

    public void resize_ToLogin() {
        Main.APP.config().resize(800,600);
    }

    public void resize_ToNormal() {
        Main.APP.config().resize((GlobalBrowserStore.window_w-10),GlobalBrowserStore.window_h);
    }

}
