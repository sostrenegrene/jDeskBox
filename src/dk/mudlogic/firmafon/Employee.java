package dk.mudlogic.firmafon;

import java.util.Hashtable;

/**
 * Created by soren.pedersen on 30-04-2016.
 */
public class Employee {

    private final int row_id;
    private final int employee_id;

    private boolean in_transfer = false;

    private Hashtable<String,String> employee = new Hashtable<>();

    public Employee(int row_id,int employee_id) {
        this.row_id = row_id;
        this.employee_id = employee_id;
    }

    public void add_value(String name,String value) {
        employee.put(name,value);
    }

    public void update_value(String name,String value) {
        try { employee.remove(name); }
        catch(Exception e) {}

        add_value(name,value);
    }

    public String get(String name) {
        try { return employee.get(name); }
        catch(Exception e) { return null; }
    }

    public int row() {
        return row_id;
    }

    public int employee_id() {
        return employee_id;
    }

    public boolean in_transfer(boolean b) {
        in_transfer = b;

        return in_transfer;
    }

    public boolean in_transfer() {
        return in_transfer;
    }
}
