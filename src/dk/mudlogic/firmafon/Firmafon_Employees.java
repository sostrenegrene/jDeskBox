package dk.mudlogic.firmafon;

import java.util.ArrayList;

/**
 * Created by soren.pedersen on 30-04-2016.
 */
public class Firmafon_Employees {

    private ArrayList<Employee> employees;
    private int local_employee_row = 0;

    public Firmafon_Employees() {
        employees = new ArrayList();
    }

    public Employee new_Employee(int employee_id) {

        int row = employees.size();
        Employee emp = new Employee(row,employee_id);
        employees.add( emp.row(),emp );

        return emp;
    }

    public Employee new_LocalEmployee(int employee_id) {

        int row = employees.size();
        local_employee_row = row;

        Employee emp = new Employee(row,employee_id);
        employees.add( emp.row(), emp );

        return emp;
    }

    public Employee get_Employee(int row) {
        try { return employees.get(row); }
        catch(Exception e) { return null; }
    }

    public Employee get_LocalEmployee() {
        try { return employees.get(local_employee_row); }
        catch(Exception e) { return null; }
    }

    public void update_Employee(Employee e) {
        employees.remove(e.row());
        employees.add(e.row(),e);
    }

}
