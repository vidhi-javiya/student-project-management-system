
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/versioningdemo")]
public class VersioningDemoController : ControllerBase
{
    private readonly string studentName = "Javiya Vidhi";
    private readonly string collegeName = "Darshan University";

    [HttpGet]
    [MapToApiVersion("1.0")]
    public IActionResult GetV1()
    {
        return Ok(new
        {
            version = "1.0",
            message = "Hello from API Version 1.0!",
            student = studentName,
            college = collegeName
        });
    }

    [HttpGet]
    [MapToApiVersion("2.0")]
    public IActionResult GetV2()
    {
        return Ok(new
        {
            version = "2.0",
            message = "Hello from API Version 2.0 with enhanced data!",
            student = studentName,
            college = collegeName,
            status = "Active Enrollment"
        });
    }

    [HttpGet("query-example")]
    [MapToApiVersion("1.0")]
    public IActionResult GetQueryV1() => Ok(new
    {
        method = "Query String",
        version = "1.0",
        student = studentName,
        college = collegeName
    });

    [HttpGet("query-example")]
    [MapToApiVersion("2.0")]
    public IActionResult GetQueryV2() => Ok(new
    {
        method = "Query String",
        version = "2.0",
        student = studentName,
        college = collegeName
    });

    [HttpGet("header-example")]
    [MapToApiVersion("1.0")]
    public IActionResult GetHeaderV1() => Ok(new
    {
        method = "Header",
        version = "1.0",
        student = studentName,
        college = collegeName
    });

    [HttpGet("header-example")]
    [MapToApiVersion("2.0")]
    public IActionResult GetHeaderV2() => Ok(new
    {
        method = "Header",
        version = "2.0",
        student = studentName,
        college = collegeName
    });
}