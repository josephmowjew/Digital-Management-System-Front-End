using MLS_Digital_Management_System_Front_End.Core.DTOs.Title;

namespace MLS_Digital_Management_System_Front_End.Services.Interfaces;

public interface ITitleService{

    Task<List<ReadTitleDTO>> GetAllTitlesAsync();
    Task<CreateTitleDTO> AddTitle(CreateTitleDTO createTitleDTO);
    Task<ReadTitleDTO> GetTitleByIdAsync(int id);
    Task RemoveTitle(int id);
    Task<ReadTitleDTO> UpdateTitle(UpdateTitleDTO updateTitleDTO);
}