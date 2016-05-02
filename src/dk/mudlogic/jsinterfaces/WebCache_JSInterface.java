package dk.mudlogic.jsinterfaces;

import dk.mudlogic.tools.interfaces.JSInterfaceExtender;

import java.util.Hashtable;

/**
 * Created by soren.pedersen on 13-04-2016.
 */
public class WebCache_JSInterface extends JSInterfaceExtender {

    private Hashtable<String,String> cache;

    /** Start a new cache interface
     *
     */
    public WebCache_JSInterface() {
        cache = new Hashtable<>();
    }

    /** Start a new cache interface with app name
     *
     * @param app_name String
     */
    public WebCache_JSInterface(String app_name) {
        cache = new Hashtable<>();
        this.setAppName(app_name);
    }

    public void add(String name,String value) {
        delete(name);
        cache.put(name, value);
    }

    public boolean delete(String name) {
        try { return (!cache.remove(name).equals("")); }
        catch(Exception e) { return false; }
    }

    public String get(String name) {
        try { return cache.get(name); }
        catch(Exception e) { return null; }
    }
}
