package dk.mudlogic.jsinterfaces;

import dk.mudlogic.firmafon.Employee;
import dk.mudlogic.firmafon.Firmafon_Employees;
import dk.mudlogic.tools.interfaces.JSInterfaceExtender;

/**
 * Created by soren.pedersen on 30-04-2016.
 */
public class Firmafon_JSInterface extends JSInterfaceExtender {

    private Firmafon_Employees employees = new Firmafon_Employees();
    private int last_added_row = 0;

    public Firmafon_JSInterface() {
    }

    public Firmafon_JSInterface(String app_name) {
        this.setAppName(app_name);
    }

    public Employee new_Employee(int id) {
        return employees.new_Employee(id);
    }

    public Employee new_LocalEmployee(int id) {
        return employees.new_LocalEmployee(id);
    }

    public void update_Employee(Employee e) {
        employees.update_Employee(e);
    }

    public Firmafon_Employees employees() {
        return employees;
    }
}
