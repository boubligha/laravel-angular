<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the employees.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $employees = Employee::with('user')->get();
        return response()->json([
            'status' => 'success',
            'employees' => $employees
        ]);
    }

    /**
     * Store a newly created employee in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'position' => 'nullable|string|max:255',
            'salary' => 'nullable|numeric',
            'status' => 'nullable|string|max:255',
            'image_url' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'work_hours_start' => 'nullable|string',
            'work_hours_end' => 'nullable|string',
            'break_time' => 'nullable|string',
            'days_off' => 'nullable|array',
            'leave_type' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $employee = Employee::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Employee created successfully',
            'employee' => $employee
        ], 201);
    }

    /**
     * Display the specified employee.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $employee = Employee::with('user', 'projets')->find($id);

        if (!$employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'employee' => $employee
        ]);
    }

    /**
     * Update the specified employee in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'position' => 'nullable|string|max:255',
            'salary' => 'nullable|numeric',
            'status' => 'nullable|string|max:255',
            'image_url' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'work_hours_start' => 'nullable|string',
            'work_hours_end' => 'nullable|string',
            'break_time' => 'nullable|string',
            'days_off' => 'nullable|array',
            'leave_type' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $employee->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Employee updated successfully',
            'employee' => $employee
        ]);
    }

    /**
     * Remove the specified employee from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee not found'
            ], 404);
        }

        $employee->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Employee deleted successfully'
        ]);
    }

    /**
     * Assign employee to project
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function assignToProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'projet_id' => 'required|exists:projets,id',
            'role' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $employee = Employee::find($request->employee_id);
        
        // Check if relation already exists
        if ($employee->projets()->where('projet_id', $request->projet_id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee is already assigned to this project'
            ], 422);
        }

        // Attach project with pivot data
        $employee->projets()->attach($request->projet_id, [
            'role' => $request->role,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Employee assigned to project successfully'
        ]);
    }

    /**
     * Remove employee from project
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function removeFromProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'projet_id' => 'required|exists:projets,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $employee = Employee::find($request->employee_id);
        
        // Check if relation exists
        if (!$employee->projets()->where('projet_id', $request->projet_id)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee is not assigned to this project'
            ], 422);
        }

        // Detach project
        $employee->projets()->detach($request->projet_id);

        return response()->json([
            'status' => 'success',
            'message' => 'Employee removed from project successfully'
        ]);
    }

    /**
     * Upload employee profile image
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function uploadImage(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee not found'
            ], 404);
        }

        // Handle file upload
        if ($request->hasFile('image')) {
            // Create directory if it doesn't exist
            $employeeImagesPath = 'public/employees/images';
            
            // Delete old image if exists
            if ($employee->image_url && Storage::exists(str_replace('/storage/', 'public/', $employee->image_url))) {
                Storage::delete(str_replace('/storage/', 'public/', $employee->image_url));
            }
            
            // Store the new image
            $imagePath = $request->file('image')->store($employeeImagesPath);
            $imageUrl = Storage::url($imagePath);
            
            // Update employee record with new image URL
            $employee->image_url = $imageUrl;
            $employee->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Profile image uploaded successfully',
                'image_url' => $imageUrl
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'No image provided'
        ], 400);
    }
}